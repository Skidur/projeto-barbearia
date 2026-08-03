const pool = require('../../config/database');

const SLOT_STEP_MINUTES = 30;

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
  async list(req, res) {
    const { rows } = await pool.query(
      `SELECT u.id, u.name, bp.specialty, bp.bio, bp.photo_url
       FROM users u
       JOIN barber_profiles bp ON bp.user_id = u.id
       ORDER BY u.name`
    );

    return res.json(rows);
  },

  async listServices(req, res) {
    const { barberId } = req.params;

    const { rows } = await pool.query(
      `SELECT id, name, description, price, duration_minutes
       FROM services
       WHERE barber_id = $1
       ORDER BY id`,
      [barberId]
    );

    return res.json(rows);
  },

  async getAvailability(req, res) {
    const { barberId } = req.params;
    const { date, serviceIds } = req.query;

    if (!date || !serviceIds) {
      return res.status(400).json({ error: 'Informe date e serviceIds.' });
    }

    const serviceIdList = String(serviceIds)
      .split(',')
      .map((id) => Number(id))
      .filter((id) => !Number.isNaN(id));

    if (serviceIdList.length === 0) {
      return res.status(400).json({ error: 'serviceIds inválido.' });
    }

    const servicesResult = await pool.query(
      `SELECT duration_minutes FROM services WHERE barber_id = $1 AND id = ANY($2::int[])`,
      [barberId, serviceIdList]
    );

    if (servicesResult.rows.length !== serviceIdList.length) {
      return res.status(400).json({ error: 'Um ou mais serviços não pertencem a esse barbeiro.' });
    }

    const totalDuration = servicesResult.rows.reduce((sum, s) => sum + s.duration_minutes, 0);

    const dayOfWeek = new Date(`${date}T00:00:00`).getDay();

    const timeOff = await pool.query(
      `SELECT id FROM barber_time_off WHERE barber_id = $1 AND date = $2`,
      [barberId, date]
    );
    if (timeOff.rows.length > 0) {
      return res.json({ slots: [] });
    }

    const schedules = await pool.query(
      `SELECT start_time, end_time FROM barber_schedules WHERE barber_id = $1 AND day_of_week = $2`,
      [barberId, dayOfWeek]
    );

    const appointments = await pool.query(
      `SELECT start_time, end_time FROM appointments
       WHERE barber_id = $1 AND date = $2 AND status != 'cancelled'`,
      [barberId, date]
    );
    const booked = appointments.rows.map((a) => ({
      start: timeToMinutes(a.start_time),
      end: timeToMinutes(a.end_time),
    }));

    const now = new Date();
    const isToday = date === now.toISOString().slice(0, 10);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const slots = [];
    for (const block of schedules.rows) {
      const blockStart = timeToMinutes(block.start_time);
      const blockEnd = timeToMinutes(block.end_time);

      for (let start = blockStart; start + totalDuration <= blockEnd; start += SLOT_STEP_MINUTES) {
        const end = start + totalDuration;

        if (isToday && start <= nowMinutes) continue;
        if (booked.some((b) => overlaps(start, end, b.start, b.end))) continue;

        slots.push(minutesToTime(start));
      }
    }

    return res.json({ slots, totalDuration });
  },
};
