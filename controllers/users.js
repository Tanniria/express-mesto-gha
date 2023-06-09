const { BAD_REQUEST_ERROR, NOT_FOUND_ERROR, DEFAULT_ERROR } = require('../errors/errors');
const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (!name || !about || !avatar || err.message) {
        res.status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(DEFAULT_ERROR)
        .send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(DEFAULT_ERROR)
      .send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (!User[userId]) {
        res.status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(DEFAULT_ERROR)
        .send({ message: err.message });
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (!name || !about || err.message) {
        res.status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные' });
        return;
      } if (!User[_id]) {
        res.status(BAD_REQUEST_ERROR)
          .send({ message: `Пользователь по указанному id:${_id} не найден` });
        return;
      }
      res.status(BAD_REQUEST_ERROR)
        .send({ message: err.message });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (!avatar) {
        res.status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные' });
        return;
      } if (!User[_id]) {
        res.status(NOT_FOUND_ERROR)
          .send({ message: `Пользователь по указанному id:${_id} не найден` });
        return;
      }
      res.status(DEFAULT_ERROR)
        .send({ message: err.message });
    });
};
