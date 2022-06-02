import express from 'express';
import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';

import User from './model/user.js';

const JWT_SECRET = '42',
      app = express(),
      jwt_middleware = expressjwt({
        secret: JWT_SECRET, algorithms: ["HS256"], credentialsRequired: false });

app.use(express.json());
app.use(express.static('public'));

app.post('/user', jwt_middleware, async (req, res, next) => {
  console.log(req.auth);

  if (!req.auth) {
    res.status(403).json({ message: 'move away' });
    return ;
  }

  try {
    const { login, password } = req.body,
          user = new User({ login, password }),
          result = await user.save();
    res.json({ message: 'success' });
  } catch (err) {
    next(err);
  }
});

app.post('/login', async (req, res, next) => {
  try {
    const { login, password } = req.body,
          user = await User.login({ login, password });

    if (!user) {
      res.status(403).json({ message: 'wallmart' });
    } else {
      const token = jwt.sign(user, JWT_SECRET);
      res.json({ token });
    }
  } catch (e) {
    next(e);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: 'Error'});
});

app.listen(3000);
