exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('barber_profiles', {
    user_id: {
      type: 'integer',
      notNull: true,
      primaryKey: true,
      references: 'users',
      onDelete: 'cascade',
    },
    bio: { type: 'text' },
    specialty: { type: 'varchar(150)' },
    photo_url: { type: 'varchar(255)' },
    is_owner: { type: 'boolean', notNull: true, default: false },
    self_manages_schedule: { type: 'boolean', notNull: true, default: false },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('barber_profiles');
};
