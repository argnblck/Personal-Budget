const envelopesService = require('../services/envelopes.service');

class EnvelopesController {
	async getAllEnvelopes(req, res) {

		try {
			const envelopes = await envelopesService.getAllEnvelopes();
			if (envelopes.rows.length < 1) {
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
		const id = Number(req.params.id);

		if (isNaN(id)) {
			return res.status(400).json({
				error: 'Указан не верный id'
			})
		}

		try {
			const envelope = await envelopesService.getEnvelopeById(id);
			if (envelope.rows.length < 1) {
				return res.status(404).json({
					error: "Запись не найдена"
				})
			}
			res.json(envelope.rows[0])
		} catch (err) {
			return res.status(500).json({
				error: err.message
			});
		}
	}

	async createEnvelope(req, res) {
		const { title, balance } = req.body;

		if (!title) {
			return res.status(400).json({
				error: 'Не указано название для создания envelope'
			})
		}
		try {
			const newEnvelope = await envelopesService.createEnvelope(title, balance);
			res.status(201).json(newEnvelope.rows[0])
		} catch (err) {
			return res.status(500).json({
				error: err.message
			});
		}
	}

	async updateEnvelopeById(req, res) {
		const id = Number(req.params.id);
		const { title, balance } = req.body;

		if (isNaN(id)) {
			return res.status(400).json({
				error: "Указан не верный id"
			})
		}
		if (!title) {
			return res.status(400).json({
				error: 'Не указано название для редактирования envelope'
			})
		}
		if (!balance) {
			return res.status(400).json({
				error: 'Не указано баланс для редактирования envelope'
			})
		}

		try {
			const updatedEnvelope = await envelopesService.updateEnvelopeById(id, title, balance);
			if (updatedEnvelope.rows.length < 1) {
				return res.status(404).json({
					error: "Запись не найдена"
				})
			}
			res.json(updatedEnvelope.rows[0]);
		} catch (err) {
			return res.status(500).json({
				error: err.message
			});
		}
	}

	async deleteEvelopeById(req, res) {
		const id = Number(req.params.id);

		if (isNaN(id)) {
			return res.status(400).json({
				error: 'Указан не верный id'
			})
		}

		try {
			const envelopeToDelete = await envelopesService.getEnvelopeById(id);
			if (envelopeToDelete.rows.length < 1) {
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
		const id = Number(req.params.id);

		if (isNaN(id)) {
			return res.status(400).json({
				error: 'Указан не верный id'
			})
		}

		const { title, amount } = req.body;

		try {
			const envelope = await envelopesService.getEnvelopeById(id);
			if (envelope.rows.length < 1) {
				return res.status(404).json({
					error: "Запись не найдена"
				})
			}

			const newTransaction = await envelopesService.createEnvelopeTransation(id, title, amount);

			res.status(201).json(newTransaction.rows[0]);
		} catch (err) {
			return res.status(500).json({
				error: err.message
			});
		}
	}

	async getEnvelopeTransactions(req, res) {
		const id = Number(req.params.id);

		if (isNaN(id)) {
			return res.status(400).json({
				error: 'Указан не верный id'
			})
		}

		try {
			const transactions = await envelopesService.getEnvelopeTransactions(id);

			if (transactions.rows.length < 1) {
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