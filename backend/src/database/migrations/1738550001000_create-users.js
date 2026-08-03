exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createType('user_role', ['client', 'barber']);

  pgm.createTable('users', {
    id: 'id',
    name: { type: 'varchar(150)', notNull: true },
    email: { type: 'varchar(150)', notNull: true, unique: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    phone: { type: 'varchar(20)' },
    role: { type: 'user_role', notNull: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
  pgm.dropType('user_role');
};
