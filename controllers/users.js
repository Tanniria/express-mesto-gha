const { bad_request_error, not_found_error, default_error } = require('../errors/errors');
const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(error => {
      if (!name || !about || !avatar || error.message) {
        res.status(bad_request_error)
          .send({ message: `Переданы некорректные данные` });
        return;
      } else {
        res.status(default_error)
          .send({ message: error.message })
      }
    })
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(default_error)
      .send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.send({ data: user }))
    .catch(err => {
      if (!User[userId]) {
        res.status(bad_request_error)
          .send({ message: `Переданы некорректные данные` })
        return;
      } else {
        res.status(default_error)
          .send({ message: err.message })
      }
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
      upsert: false
    })
    .then((user) => res.send({ data: user }))
    .catch(err => {
      if (!name || !about || err.message) {
        res.status(bad_request_error)
          .send({ message: `Переданы некорректные данные` })
        return;
      } else if (!User[_id]) {
        res.status(not_found_error)
          .send({ message: `Пользователь по указанному id:${_id} не найден` });
        return;
      } else {
        res.status(default_error)
          .send({ message: err.message })
      }
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
      upsert: false
    })
    .then((user) => res.send({ data: user }))
    .catch(err => {
      if (!avatar) {
        res.status(bad_request_error)
          .send({ message: `Переданы некорректные данные` })
        return;
      } else if (!User[_id]) {
        res.status(not_found_error)
          .send({ message: `Пользователь по указанному id:${_id} не найден` });
        return;
      } else {
        res.status(default_error)
          .send({ message: err.message })
      }
    });
};