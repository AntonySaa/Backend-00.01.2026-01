const express = require('express');

const users = require('../../data/users');
const requireJson = require('../../middlewares/requireJson');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ data: users });
});

router.post('/', requireJson, (req, res) => {
  const { name, email } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name is required and must be a string' });
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'email is required and must be valid' });
  }

  const user = {
    id: users.length + 1,
    name: name.trim(),
    email: email.trim().toLowerCase()
  };

  users.push(user);

  return res.status(201).json({ data: user });
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((item) => item.id === id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({ data: user });
});

module.exports = router;
