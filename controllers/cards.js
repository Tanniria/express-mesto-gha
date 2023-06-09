const Card = require('../models/card');
const { BAD_REQUEST_ERROR, NOT_FOUND_ERROR, DEFAULT_ERROR } = require('../errors/errors');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (!name || !link || err.message) {
        res.status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(DEFAULT_ERROR)
        .send({ message: err.message });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(DEFAULT_ERROR)
      .send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => res.send({ data: card }))
    .catch(() => {
      if (!Card[cardId]) {
        res.status(DEFAULT_ERROR)
          .send({ message: `Карточка с указанным id: ${cardId} не найдена` });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(DEFAULT_ERROR)
      .send({ message: err.message }));
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch(() => {
      if (!Card[cardId]) {
        res.status(NOT_FOUND_ERROR)
          .send({ message: `Карточка с указанным id: ${cardId} не найдена` });
      }
    });
};
