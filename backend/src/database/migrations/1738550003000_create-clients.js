exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('clients', {
    id: 'id',
    name: { type: 'varchar(150)', notNull: true },
    phone: { type: 'varchar(20)', notNull: true },
    email: { type: 'varchar(150)' },
    user_id: { type: 'integer', references: 'users', onDelete: 'set null' },
    created_by: { type: 'integer', references: 'users', onDelete: 'set null' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('clients');
};
