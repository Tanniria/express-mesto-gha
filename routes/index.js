const router = require('express').Router();
const userRouter = require('./users');
const cardsRouter = require('./cards');
const { NOT_FOUND_ERROR } = require('../utils/errors');

router.use(userRouter);
router.use(cardsRouter);
router.use('/', (req, res) => {
  res.status(NOT_FOUND_ERROR)
    .send({ message: 'Произошла  ошибка на сервере' });
});

module.exports = router;