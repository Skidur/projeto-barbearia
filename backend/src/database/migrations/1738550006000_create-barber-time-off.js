exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('barber_time_off', {
    id: 'id',
    barber_id: { type: 'integer', notNull: true, references: 'users', onDelete: 'cascade' },
    date: { type: 'date', notNull: true },
    note: { type: 'text' },
    requested_by: { type: 'integer', references: 'users', onDelete: 'set null' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('barber_time_off');
};
