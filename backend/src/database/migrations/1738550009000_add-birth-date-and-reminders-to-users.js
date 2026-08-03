exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('users', {
    birth_date: { type: 'date', notNull: true },
    reminder_email: { type: 'boolean', notNull: true, default: false },
    reminder_whatsapp: { type: 'boolean', notNull: true, default: false },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('users', ['birth_date', 'reminder_email', 'reminder_whatsapp']);
};
