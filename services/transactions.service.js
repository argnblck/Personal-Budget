const db = require('./db');
const moment = require('moment');


class TransactionsService {
	async getAllTransactions() {
		const query = 'SELECT * FROM transactions'
		const transactions = await db.query(query);
		return transactions;
	}

	async getTransactionById(id) {
		const query = 'SELECT * FROM transactions WHERE id = $1';
		const transaction = await db.query(query, [id]);
		return transaction;
	}

	async updateTransactionById(id, title, amount) {
		const date = moment().format('YYYY-MM-DD HH:mm:ss');
		console.log(date);
		//, updated_At = $3

		const previousAmountQuery = 'SELECT amount FROM transactions WHERE id = $1';
		const updateTransactionQuery = 'UPDATE transactions SET title = $1, amount = $2 WHERE id = $3 RETURNING *';
		const updateEnvelopeQuery = 'UPDATE envelopes SET balance = (balance + $1) - $2 WHERE id IN (SELECT envelope_id FROM transactions WHERE id = $3)'

		const client = await db.getClient();

		try {
			await client.query('BEGIN');

			const previousAmount = await client.query(previousAmountQuery, [id]);
			await client.query(updateEnvelopeQuery, [previousAmount.rows[0].amount, amount, id]);
			const updatedTransaction = await client.query(updateTransactionQuery, [title, amount, id]);

			await client.query('COMMIT');
			await client.end();

			return updatedTransaction;
		} catch (err) {
			await client.query('ROLLBACK');
			await client.end();
			throw err;
		}

	}

	async deleteTransactionById(id) {
		const amoutQuery = 'SELECT amount FROM transactions WHERE id = $1';
		const updateEnvelopeQuery = 'UPDATE envelopes SET balance = balance + $1 WHERE id IN (SELECT envelope_id FROM transactions WHERE id = $2)'
		const deleteQuery = 'DELETE FROM transactions WHERE id = $1';

		const client = await db.getClient();

		try {
			await client.query('BEGIN');

			const amount = await client.query(amoutQuery, [id]);
			await client.query(updateEnvelopeQuery, [amount.rows[0].amount, id]);
			await client.query(deleteQuery, [id]);

			await client.query('COMMIT');
			await client.end();

			return;
		} catch (err) {
			await client.query('ROLLBACK');
			await client.end();

			throw err;
		}
	}
}

module.exports = new TransactionsService();