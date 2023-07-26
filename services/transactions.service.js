const db = require('./db');
const moment = require('moment');

const date = moment().format('YYYY-MM-DD HH:mm:ss');
console.log(date);

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
		const query = 'UPDATE envelopes SET title = $1, balance = $2 WHERE id = $3 RETURNING *'
		const updatedEnvelope = await db.query(query, [title, balance, id]);
		return updatedEnvelope;
	}

	async deleteTransactionById(id) {
		const query = 'DELETE FROM envelopes WHERE id = $1';
		const result = db.query(query, [id]);
		return result;
	}
}

module.exports = new TransactionsService();