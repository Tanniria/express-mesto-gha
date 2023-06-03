const router = require('express').Router();
const { createCard, getCards, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards', deleteCard);
router.delete('/cards', dislikeCard);
router.put('/cards', likeCard);

module.exports = router;