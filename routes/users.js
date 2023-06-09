const express = require('express');
const  router = express.Router();
const jwt = require('jsonwebtoken');
const nano = require('nano');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();
const secretKey = process.env.SECRET_KEY;

// Налаштування підключення до бази даних
const couchUrl = process.env.COUCH_URL;
const dbName = process.env.DB_NAME_USERS;
const username = process.env.NAME;
const password = process.env.PASSWORD;
const db = nano({
  url: couchUrl,
  requestDefaults: {
    auth: {
      username,
      password
    }
  }
}).use(dbName);

db.info((err, body) => {
  if (err) {
    console.error('Помилка підключення до бази даних:', err);
  } else {
    console.log('Підключено до бази даних:', body);
  }
});

function generateToken(email) {
  const expiresIn = '1h';
  return  jwt.sign({ email }, secretKey, { expiresIn });
}

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    try {
      await db.get(email);
      return res.status(400).json({ error: 'A user with this email already exists' });
    } catch (error) {
      if (error.statusCode !== 404) {
        throw error;
      }
    }

    // Хешування пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Збереження нового користувача в базі даних
    await db.insert({ _id: email, password: hashedPassword });

    const token = generateToken(email);

    res.status(201).json({ message: 'Registration is successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    let user;
    try {
      user = await db.get(email);
    } catch (error) {
      if (error.statusCode === 404) {
        return res.status(401).json({ error: 'Incorrect email or password' });
      } else {
        throw error;
      }
    }

    // Перевірка пароля
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }

    // Генерація JWT токена
    const token = generateToken(email);

      res.json({ message: 'Successful login', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
