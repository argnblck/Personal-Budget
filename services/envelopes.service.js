const db = require('./db');

class EnvelopesService {

	async getAllEnvelopes() {
		const query = 'SELECT * FROM envelopes';
		const envelopes = await db.query(query);
		return envelopes;
	}

	async getEnvelopeById(id) {
		if (!id) {
			throw new Error('Не указан id')
		}
		const query = 'SELECT * FROM envelopes WHERE id = $1';
		const envelope = await db.query(query, [id]);
		return envelope;
	}

	async createEnvelope(title, balance) {
		if (!title) {
			throw new Error('Не указано название для создания envelope')
		}
		const query = 'INSERT IN envelopes(title, balance), VALUES($1, $2) RETURNING *';
		const newEnvelope = await db.query(query, [title, balance]);
		return newEnvelope;
	}

	async updateEnvelopeById(id, title, balance) {
		if (!id) {
			throw new Error('Не указан id')
		}
		if (!title) {
			throw new Error('Не указано название')
		}
		if (!balance) {
			throw new Error('Не указан баланс')
		}

		const query = 'UPDATE envelopes SET title = $1, balance = $2 WHERE id = $3 RETURNING *'
		const updatedEnvelope = await db.query(query, [title, balance, id]);
		return updatedEnvelope;
	}

	async deleteEvelopeById(id) {
		if (!id) {
			throw new Error('Не указан id')
		}

		const query = 'DELETE FROM envelopes WHERE id = $1';
		const result = db.query(query, [id]);
		return result;
	}
}

module.exports = new EnvelopesService();