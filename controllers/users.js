const User = require('../models/user');
const { BAD_REQUEST_ERROR, NOT_FOUND_ERROR, DEFAULT_ERROR } = require('../utils/errors');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(DEFAULT_ERROR)
          .send({ message: err.message });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(DEFAULT_ERROR)
      .send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('Not Found ID'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'Not Found ID') {
        res.status(NOT_FOUND_ERROR)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.status(DEFAULT_ERROR)
          .send({ message: err.message });
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'Not Found ID') {
        res.status(NOT_FOUND_ERROR)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.status(DEFAULT_ERROR)
          .send({ message: err.message });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'Not Found ID') {
        res.status(NOT_FOUND_ERROR)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.status(DEFAULT_ERROR)
          .send({ message: err.message });
      }
    });
};
