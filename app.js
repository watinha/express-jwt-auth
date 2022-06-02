import express from 'express';

import User from './model/user.js';

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/user', async (req, res, next) => {
  try {
    const { login, password } = req.body,
          user = new User({ login, password }),
          result = await user.save();
    res.json({ message: 'success' });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: 'Error'});
});

app.listen(3000);
