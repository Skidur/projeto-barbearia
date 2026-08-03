const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('../../config/database');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateToken(user) {
  return jwt.sign({ role: user.role }, process.env.JWT_SECRET, {
    subject: String(user.id),
    expiresIn: '7d',
  });
}

module.exports = {
  async register(req, res) {
    const {
      name,
      email,
      password,
      phone,
      birth_date: birthDate,
      reminder_email: reminderEmail,
      reminder_whatsapp: reminderWhatsapp,
    } = req.body;

    if (!name || !email || !password || !birthDate || !phone) {
      return res.status(400).json({ error: 'Nome, email, senha, telefone e data de nascimento são obrigatórios.' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Email inválido.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha precisa ter pelo menos 6 caracteres.' });
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Já existe uma conta com esse email.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash, phone, role, birth_date, reminder_email, reminder_whatsapp)
       VALUES ($1, $2, $3, $4, 'client', $5, $6, $7)
       RETURNING id, name, email, phone, role, birth_date, reminder_email, reminder_whatsapp, created_at`,
      [name, email, passwordHash, phone || null, birthDate, !!reminderEmail, !!reminderWhatsapp]
    );

    const user = rows[0];

    // Todo cliente precisa de um registro em `clients` para poder agendar,
    // mesmo os que se cadastram pelo site (sem isso, quem o barbeiro cadastra
    // manualmente e quem se registra sozinho não ficariam na mesma tabela).
    await pool.query(
      `INSERT INTO clients (name, phone, email, user_id)
       VALUES ($1, $2, $3, $4)`,
      [user.name, user.phone, user.email, user.id]
    );

    return res.status(201).json({ user, token: generateToken(user) });
  },

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token: generateToken(user),
    });
  },
};
