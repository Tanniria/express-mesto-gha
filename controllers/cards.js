const Card = require('../models/card');
const { bad_request_error, not_found_error, default_error } = require('../errors/errors');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch(err => {
      if (!name || !link || err.message) {
        res.status(bad_request_error)
          .send({ message: `Переданы некорректные данные при создании карточки` });
        return;
      } else {
        res.status(default_error)
          .send({ message: err.message })
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(default_error)
      .send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => res.send({ data: card }))
    .catch(() => {
      if (!Card[cardId]) {
        res.status(default_error)
          .send({ message: `Карточка с указанным id: ${cardId} не найдена` })
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
    .catch((err) => res.status(default_error)
      .send({ message: err.message }));
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch(() => {
      if (!Card[cardId]) {
        res.status(ERROR_NOT_FOUND)
          .send({ message: `Карточка с указанным id: ${cardId} не найдена` })
      }
    });
};

