const express = require('express');
const mongoose = require('mongoose');
const { NOT_FOUND_ERROR } = require('./utils/errors');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '64833fc2980972df97cfb017',
  };
  next();
});

app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

app.use('/*', (req, res) => {
  res.status(NOT_FOUND_ERROR)
    .send({ message: 'Произошла  ошибка на сервере' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
