const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub, role } = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = sub;
    req.userRole = role;
    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido.' });
  }
};
