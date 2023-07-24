const envelopesService = require('../services/envelopes.service');

class EnvelopesController {
	async getAllEnvelopes(req, res) {

		try {
			const envelopes = await envelopesService.getAllEnvelopes();
			if (envelopes.rowsCount < 1) {
				return res.status(404).json({
					error: "Записи не найдены"
				})
			}
			res.json(envelopes.rows)
		} catch (err) {
			return res.status(500).json({
				error: err.message
			});
		}
	}

	async getEnvelopeById(req, res) {
		const { id } = req.query;

		try {
			const envelope = await envelopesService.getEnvelopeById(id);
			if (envelope.rowsCount < 1) {
				return res.status(404).json({
					error: "Запись не найдена"
				})
			}
			res.json(envelopes.rows[0])
		} catch (err) {
			return res.status(500).json({
				error: err.message
			});
		}
	}

	async createEnvelope(req, res) {
		const { title, balance } = req.body;

		try {
			const newEnvelope = await envelopesService.createEnvelope(title, balance);
			res.json(newEnvelope.rows[0])
		} catch (err) {
			return res.status(500).json({
				error: err.message
			});
		}
	}

	async updateEnvelopeById(req, res) {
		const { id } = req.query;
		const { title, balance } = req.body;

		try {
			const updatedEnvelope = await envelopesService.updateEnvelopeById(id, title, balance);
			res.json(updatedEnvelope.rows[0]);
		} catch (err) {
			return res.status(500).json({
				error: err.message
			});
		}
	}

	async deleteEvelopeById(req, res) {
		const { id } = req.query;

		try {
			const envelopeToDelete = await envelopesService.getEnvelopeById(id);
			if (envelopeToDelete.rowCount < 1) {
				return res.status(404).send({
					error: "Запись не найдена"
				})
			}
			await envelopesService.deleteEvelopeById(id);
			res.sendStatus(204)
		} catch (err) {
			return res.status(500).json({
				error: err.message
			});
		}
	}

	async createEnvelopeTransation(req, res) {
		const { id } = req.query;
		const { recipientEnvelopeId, amount } = req.body;

		try {
			const senderEnvelope = await envelopesService.getEnvelopeById(id);
			if (senderEnvelope.rowsCount < 1) {
				return res.status(404).json({
					error: "Отправитель не найден"
				})
			}

			const recipientEnvelope = await envelopesService.getEnvelopeById(recipientEnvelopeId);
			if (recipientEnvelope.rowsCount < 1) {
				return res.status(404).json({
					error: "Получатель не найден"
				})
			}

			const newTransaction = await envelopesService.createEnvelopeTransation(id, recipientEnvelopeId, amount);

			res.status(201).json(newTransaction.rows[0]);
		} catch (err) {
			return res.status(500).json({
				error: err.message
			});
		}
	}

	async getEnvelopeTransactions(req, res) {
		const { id } = req.query;

		try {
			const transactions = await envelopesService.getEnvelopeTransactions(id);

			if (transactions.rowsCount < 1) {
				return res.status(404).json({
					error: "Транзакции не найдены"
				})
			}
			res.json(transactions.rows);
		} catch (err) {
			return res.status(500).json({
				error: err.message
			});
		}
	}
}

module.exports = new EnvelopesController();