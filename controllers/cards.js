const Card = require('../models/card');
const { BAD_REQUEST_ERROR, NOT_FOUND_ERROR, DEFAULT_ERROR } = require('../errors/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(DEFAULT_ERROR)
      .send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(DEFAULT_ERROR)
          .send({ message: err.message });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .orFail(new Error('Not Found ID'))
    .then(() => res.send({ message: 'Пост удален' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR)
          .send({ message: 'Карточка не найдена' });
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
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  )
    .orFail(new Error('Not Found ID'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR)
          .send({ message: 'Карточка не найдена' });
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
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndRemove(
    cardId,
    { $pull: { likes: _id } },
    { new: true },
  )
    .orFail(new Error('Not Found ID'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR)
          .send({ message: 'Карточка не найдена' });
      } else if (err.message === 'Not Found ID') {
        res.status(NOT_FOUND_ERROR)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(DEFAULT_ERROR)
          .send({ message: err.message });
      }
    });
};
