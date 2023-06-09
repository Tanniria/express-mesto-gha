const router = require('express').Router();
const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.delete('/:cardId/likes', dislikeCard);
router.put('/:cardId/likes', likeCard);

module.exports = router;
