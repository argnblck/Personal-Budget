const transactionsService = require('../services/transactions.service');

class TransactionsController {
	async getAllTransactions(req, res) {

		try {
			const transactions = await transactionsService.getAllTransactions();
			if (transactions.rows.length < 1) {
				return res.status(404).json({
					error: "Транзакции не найдены"
				})
			}
			res.json(transactions.rows)
		} catch (err) {
			return res.status(500).json({
				error: err.message
			});
		}
	}

	async getTransactionById(req, res) {
		const id = Number(req.params.id);

		if (isNaN(id)) {
			return res.status(400).json({
				error: 'Указан не верный id'
			})
		}

		try {
			const transaction = await transactionsService.getTransactionById(id);
			if (transaction.rows.length < 1) {
				return res.status(404).json({
					error: "Транзакция не найдена"
				})
			}
			res.json(transaction.rows[0])
		} catch (err) {
			return res.status(500).json({
				error: err.message
			});
		}
	}

	async updateTransactionById(req, res) {
		const id = Number(req.params.id);
		const { title, amount } = req.body;

		if (isNaN(id)) {
			return res.status(400).json({
				error: "Указан не верный id"
			})
		}
		if (!title) {
			return res.status(400).json({
				error: 'Не указано название для редактирования транзакции'
			})
		}
		if (!amount) {
			return res.status(400).json({
				error: 'Не указана сумма для редактирования транзакции'
			})
		}

		try {
			const transactionToUpdate = await transactionsService.getTransactionById(id);
			if (transactionToDelete.rows.length < 1) {
				return res.status(404).send({
					error: "Запись не найдена"
				})
			}


			const updatedTransaction = await transactionsService.updateTransactionById(id, title, amount);
			if (updatedEnvelope.rows.length < 1) {
				return res.status(404).json({
					error: "Запись не найдена"
				})
			}
			res.json(updatedTransaction.rows[0]);
		} catch (err) {
			return res.status(500).json({
				error: err.message
			});
		}
	}

	async deleteTransactionById(req, res) {
		const id = Number(req.params.id);

		if (isNaN(id)) {
			return res.status(400).json({
				error: 'Указан не верный id'
			})
		}

		try {
			const transactionToDelete = await transactionsService.getTransactionById(id);
			if (transactionToDelete.rows.length < 1) {
				return res.status(404).send({
					error: "Запись не найдена"
				})
			}
			await transactionsService.deleteTransactionById(id);
			res.sendStatus(204)
		} catch (err) {
			return res.status(500).json({
				error: err.message
			});
		}
	}
}

module.exports = new TransactionsController();