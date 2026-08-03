exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('services', {
    id: 'id',
    barber_id: { type: 'integer', notNull: true, references: 'users', onDelete: 'cascade' },
    name: { type: 'varchar(150)', notNull: true },
    description: { type: 'text' },
    price: { type: 'numeric(10,2)', notNull: true },
    duration_minutes: { type: 'integer', notNull: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('services');
};
