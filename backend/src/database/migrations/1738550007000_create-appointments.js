exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createType('appointment_status', ['confirmed', 'cancelled', 'completed']);

  pgm.createTable('appointments', {
    id: 'id',
    client_id: { type: 'integer', notNull: true, references: 'clients', onDelete: 'restrict' },
    barber_id: { type: 'integer', notNull: true, references: 'users', onDelete: 'restrict' },
    date: { type: 'date', notNull: true },
    start_time: { type: 'time', notNull: true },
    end_time: { type: 'time', notNull: true },
    status: { type: 'appointment_status', notNull: true, default: 'confirmed' },
    booked_by: { type: 'integer', notNull: true, references: 'users', onDelete: 'restrict' },
    cancelled_at: { type: 'timestamp' },
    cancelled_by: { type: 'integer', references: 'users', onDelete: 'set null' },
    cancellation_reason: { type: 'text' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });

  pgm.addConstraint('appointments', 'appointments_time_check', 'CHECK (end_time > start_time)');
};

exports.down = (pgm) => {
  pgm.dropTable('appointments');
  pgm.dropType('appointment_status');
};
