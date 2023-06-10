const Card = require('../models/card');
const { BAD_REQUEST_ERROR, NOT_FOUND_ERROR, DEFAULT_ERROR } = require('../utils/errors');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (!name || !link || err.message) {
        res.status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(DEFAULT_ERROR)
          .send({ message: err.message });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(DEFAULT_ERROR)
      .send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('Not Found ID'))
    .then(() => res.send({ message: 'Пост удален' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'Not Found ID') {
        res.status(NOT_FOUND_ERROR)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(DEFAULT_ERROR)
          .send({ message: err.message });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Not Found ID'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'Not Found ID') {
        res.status(NOT_FOUND_ERROR)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(DEFAULT_ERROR)
          .send({ message: err.message });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Not Found ID'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'Not Found ID') {
        res.status(NOT_FOUND_ERROR)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(DEFAULT_ERROR)
          .send({ message: err.message });
      }
    });
};
