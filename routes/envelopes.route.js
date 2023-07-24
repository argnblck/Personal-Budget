const Router = require('express-promise-router');
const envelopesController = require('../controllers/envelopes.controller');

const router = new Router();

router.get('/', envelopesController.getAllEnvelopes);

router.get('/:id', envelopesController.getEnvelopeById);

router.get('/:id/transactions', envelopesController.getEnvelopeTransactions);

router.post('/', envelopesController.createEnvelope);

router.post('/:id/transactions', envelopesController.createEnvelopeTransation);

router.put('/:id', envelopesController.updateEnvelopeById);

router.delete('/:id', envelopesController.deleteEvelopeById);

module.exports = router; 