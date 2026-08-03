exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    'appointment_services',
    {
      appointment_id: { type: 'integer', notNull: true, references: 'appointments', onDelete: 'cascade' },
      service_id: { type: 'integer', notNull: true, references: 'services', onDelete: 'restrict' },
      price_at_booking: { type: 'numeric(10,2)', notNull: true },
      duration_at_booking: { type: 'integer', notNull: true },
    },
    {
      constraints: {
        primaryKey: ['appointment_id', 'service_id'],
      },
    }
  );
};

exports.down = (pgm) => {
  pgm.dropTable('appointment_services');
};
