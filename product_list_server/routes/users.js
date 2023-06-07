const express = require('express');
const  router = express.Router();
const User = require('../models/user');
const secretKey = '3F8aG^vE9*@$2#M!Ks6h#5tN7dQfZp';
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password)
  try {
    // Перевірка користувача та пароля в базі даних
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Incorrect username or password' });
    }

    // Генерування JWT токена для аутентифікованого користувача
    const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});


router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this name already exists' });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
