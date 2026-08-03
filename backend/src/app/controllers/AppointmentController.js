const pool = require('../../config/database');

const MIN_CANCELLATION_NOTICE_MINUTES = 120;

function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const minutes = String(totalMinutes % 60).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function overlaps(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

module.exports = {
  async create(req, res) {
    const { barberId, date, startTime, serviceIds } = req.body;

    if (!barberId || !date || !startTime || !Array.isArray(serviceIds) || serviceIds.length === 0) {
      return res.status(400).json({ error: 'barberId, date, startTime e serviceIds são obrigatórios.' });
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      let clientResult = await client.query('SELECT id FROM clients WHERE user_id = $1', [req.userId]);
      if (clientResult.rows.length === 0) {
        // Contas criadas antes do registro passar a gerar a linha em `clients`
        // automaticamente caem aqui. Criamos na hora em vez de travar o agendamento.
        clientResult = await client.query(
          `INSERT INTO clients (name, phone, email, user_id)
           SELECT name, phone, email, id FROM users WHERE id = $1
           RETURNING id`,
          [req.userId]
        );
      }
      const clientId = clientResult.rows[0].id;

      const servicesResult = await client.query(
        `SELECT id, price, duration_minutes FROM services WHERE barber_id = $1 AND id = ANY($2::int[])`,
        [barberId, serviceIds]
      );
      if (servicesResult.rows.length !== serviceIds.length) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Um ou mais serviços não pertencem a esse barbeiro.' });
      }

      const totalDuration = servicesResult.rows.reduce((sum, s) => sum + s.duration_minutes, 0);
      const startMinutes = timeToMinutes(startTime);
      const endMinutes = startMinutes + totalDuration;
      const endTime = minutesToTime(endMinutes);

      const dayOfWeek = new Date(`${date}T00:00:00`).getDay();

      const scheduleResult = await client.query(
        `SELECT start_time, end_time FROM barber_schedules WHERE barber_id = $1 AND day_of_week = $2`,
        [barberId, dayOfWeek]
      );
      const fitsSchedule = scheduleResult.rows.some(
        (block) => startMinutes >= timeToMinutes(block.start_time) && endMinutes <= timeToMinutes(block.end_time)
      );
      if (!fitsSchedule) {
        await client.query('ROLLBACK');
        return res.status(409).json({ error: 'Esse horário está fora do expediente do barbeiro.' });
      }

      const timeOffResult = await client.query(
        `SELECT id FROM barber_time_off WHERE barber_id = $1 AND date = $2`,
        [barberId, date]
      );
      if (timeOffResult.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({ error: 'O barbeiro não trabalha nesse dia.' });
      }

      // FOR UPDATE trava as linhas de agendamento desse barbeiro/dia até o commit,
      // pra duas pessoas não conseguirem reservar o mesmo horário ao mesmo tempo.
      const existingResult = await client.query(
        `SELECT start_time, end_time FROM appointments
         WHERE barber_id = $1 AND date = $2 AND status != 'cancelled'
         FOR UPDATE`,
        [barberId, date]
      );
      const hasConflict = existingResult.rows.some((a) =>
        overlaps(startMinutes, endMinutes, timeToMinutes(a.start_time), timeToMinutes(a.end_time))
      );
      if (hasConflict) {
        await client.query('ROLLBACK');
        return res.status(409).json({ error: 'Esse horário acabou de ser reservado. Escolha outro.' });
      }

      const appointmentResult = await client.query(
        `INSERT INTO appointments (client_id, barber_id, date, start_time, end_time, booked_by)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, date, start_time, end_time, status`,
        [clientId, barberId, date, startTime, endTime, req.userId]
      );
      const appointment = appointmentResult.rows[0];

      for (const service of servicesResult.rows) {
        await client.query(
          `INSERT INTO appointment_services (appointment_id, service_id, price_at_booking, duration_at_booking)
           VALUES ($1, $2, $3, $4)`,
          [appointment.id, service.id, service.price, service.duration_minutes]
        );
      }

      await client.query('COMMIT');

      return res.status(201).json({
        ...appointment,
        services: servicesResult.rows,
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async listMine(req, res) {
    const clientResult = await pool.query('SELECT id FROM clients WHERE user_id = $1', [req.userId]);
    if (clientResult.rows.length === 0) {
      return res.json([]);
    }
    const clientId = clientResult.rows[0].id;

    const { rows: appointments } = await pool.query(
      `SELECT a.id, a.date, a.start_time, a.end_time, a.status, u.name AS barber_name
       FROM appointments a
       JOIN users u ON u.id = a.barber_id
       WHERE a.client_id = $1
       ORDER BY a.date DESC, a.start_time DESC`,
      [clientId]
    );

    if (appointments.length === 0) {
      return res.json([]);
    }

    const appointmentIds = appointments.map((a) => a.id);
    const { rows: services } = await pool.query(
      `SELECT aps.appointment_id, s.name, aps.price_at_booking
       FROM appointment_services aps
       JOIN services s ON s.id = aps.service_id
       WHERE aps.appointment_id = ANY($1::int[])`,
      [appointmentIds]
    );

    const servicesByAppointment = {};
    for (const s of services) {
      if (!servicesByAppointment[s.appointment_id]) servicesByAppointment[s.appointment_id] = [];
      servicesByAppointment[s.appointment_id].push({ name: s.name, price: s.price_at_booking });
    }

    return res.json(
      appointments.map((a) => ({
        ...a,
        services: servicesByAppointment[a.id] || [],
      }))
    );
  },

  async cancel(req, res) {
    const { id } = req.params;

    const { rows } = await pool.query(
      `SELECT a.id, a.date, a.start_time, a.status, c.user_id AS client_user_id
       FROM appointments a
       JOIN clients c ON c.id = a.client_id
       WHERE a.id = $1`,
      [id]
    );
    const appointment = rows[0];

    if (!appointment || Number(appointment.client_user_id) !== Number(req.userId)) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }
    if (appointment.status === 'cancelled') {
      return res.status(409).json({ error: 'Esse agendamento já está cancelado.' });
    }

    const appointmentDate = appointment.date.toISOString().slice(0, 10);
    const appointmentStart = new Date(`${appointmentDate}T${appointment.start_time}`);
    const minutesUntil = (appointmentStart.getTime() - Date.now()) / 60000;

    if (minutesUntil < MIN_CANCELLATION_NOTICE_MINUTES) {
      return res.status(409).json({
        error: `Cancelamentos precisam ser feitos com pelo menos ${MIN_CANCELLATION_NOTICE_MINUTES / 60} horas de antecedência.`,
      });
    }

    await pool.query(
      `UPDATE appointments SET status = 'cancelled', cancelled_at = now(), cancelled_by = $1 WHERE id = $2`,
      [req.userId, id]
    );

    return res.status(204).send();
  },
};
