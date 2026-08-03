exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('barber_schedules', {
    id: 'id',
    barber_id: { type: 'integer', notNull: true, references: 'users', onDelete: 'cascade' },
    day_of_week: { type: 'smallint', notNull: true },
    start_time: { type: 'time', notNull: true },
    end_time: { type: 'time', notNull: true },
  });

  pgm.addConstraint(
    'barber_schedules',
    'barber_schedules_day_of_week_check',
    'CHECK (day_of_week BETWEEN 0 AND 6)'
  );
  pgm.addConstraint(
    'barber_schedules',
    'barber_schedules_time_check',
    'CHECK (end_time > start_time)'
  );
};

exports.down = (pgm) => {
  pgm.dropTable('barber_schedules');
};
