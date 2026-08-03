require('dotenv').config();

const bcrypt = require('bcryptjs');

const pool = require('../../config/database');

const DEFAULT_PASSWORD = 'barbeiro123';

const BARBERS = [
  { name: 'João Silva', email: 'joao@barberflow.test', specialty: 'Cortes Modernos', isOwner: true, selfManagesSchedule: true },
  { name: 'Carlos Pereira', email: 'carlos@barberflow.test', specialty: 'Barba Terapia', isOwner: false, selfManagesSchedule: false },
  { name: 'Miguel Santos', email: 'miguel@barberflow.test', specialty: 'Visagismo e Estilo', isOwner: false, selfManagesSchedule: false },
];

const SERVICES = [
  { name: 'Corte de Cabelo', description: 'Máquina e tesoura, finalizado com os melhores produtos.', price: 50, durationMinutes: 30 },
  { name: 'Barba Terapia', description: 'Navalha, toalha quente e produtos especiais para a pele.', price: 40, durationMinutes: 30 },
  { name: 'Combo (Cabelo + Barba)', description: 'O pacote completo para um visual impecável.', price: 80, durationMinutes: 60 },
];

const WORK_DAYS = [1, 2, 3, 4, 5, 6]; // segunda a sábado

async function seed() {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  for (const barber of BARBERS) {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [barber.email]);
    if (existing.rows.length > 0) {
      console.log(`Já existe, pulando: ${barber.email}`);
      continue;
    }

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, birth_date)
       VALUES ($1, $2, $3, 'barber', '1990-01-01')
       RETURNING id`,
      [barber.name, barber.email, passwordHash]
    );
    const barberId = rows[0].id;

    await pool.query(
      `INSERT INTO barber_profiles (user_id, specialty, is_owner, self_manages_schedule)
       VALUES ($1, $2, $3, $4)`,
      [barberId, barber.specialty, barber.isOwner, barber.selfManagesSchedule]
    );

    for (const service of SERVICES) {
      await pool.query(
        `INSERT INTO services (barber_id, name, description, price, duration_minutes)
         VALUES ($1, $2, $3, $4, $5)`,
        [barberId, service.name, service.description, service.price, service.durationMinutes]
      );
    }

    for (const day of WORK_DAYS) {
      await pool.query(
        `INSERT INTO barber_schedules (barber_id, day_of_week, start_time, end_time)
         VALUES ($1, $2, '09:00', '19:00')`,
        [barberId, day]
      );
    }

    console.log(`Criado: ${barber.name} (${barber.email})`);
  }

  console.log(`\nSenha de todos os barbeiros de teste: ${DEFAULT_PASSWORD}`);
  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
