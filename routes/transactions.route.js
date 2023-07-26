const Router = require('express-promise-router');
const transactionsController = require('../controllers/envelopes.controller');

const router = new Router();

router.get('/', transactionsController.getAllTransactions);

router.get('/:id', transactionsController.getTransactionById);

router.put('/:id', transactionsController.updateTransactionById);

router.delete('/:id', transactionsController.deleteTransactionById);

module.exports = router; 