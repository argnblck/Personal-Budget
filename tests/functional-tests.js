const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../app');

chai.use(chaiHttp);

let idToDelete;
let transactionIdToDelete;

describe('Functional Tests', () => {
	describe('Post envelopes request test', () => {
		it('Create envelope without balance', (done) => {
			chai
				.request(server)
				.keepOpen()
				.post('/api/envelopes')
				.send({
					title: "First Test Envelope"
				})
				.end((err, res) => {
					assert.equal(res.status, 201);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.title, 'First Test Envelope');
					assert.equal(res.body.balance, 0);
					idToDelete = res.body.id;
					done();
				})
		});
		it('Create envelope with invalid balance', (done) => {
			chai
				.request(server)
				.keepOpen()
				.post('/api/envelopes')
				.send({
					title: 'Second Test Envelope',
					balance: '2oo.55'
				})
				.end((err, res) => {
					assert.equal(res.status, 500);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.error, 'invalid input syntax for type numeric: "2oo.55"');
					done();
				})
		});
		it('Create envelope without title', (done) => {
			chai
				.request(server)
				.keepOpen()
				.post('/api/envelopes')
				.send({
					balance: 200.55
				})
				.end((err, res) => {
					assert.equal(res.status, 400);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.error, 'Не указано название для создания envelope');
					done();
				})
		});
	})
	describe('Get envelopes request test', () => {
		it('Get all envelopes', (done) => {
			chai
				.request(server)
				.keepOpen()
				.get('/api/envelopes')
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.equal(Array.isArray(res.body), true);
					done();
				})
		});
		it('Get envelope by id', (done) => {
			chai
				.request(server)
				.keepOpen()
				.get(`/api/envelopes/${idToDelete}`)
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.title, 'First Test Envelope');
					assert.equal(res.body.balance, 0);
					done();
				})
		});
		it('Get envelope with invalid id', (done) => {
			chai
				.request(server)
				.keepOpen()
				.get(`/api/envelopes/9000`)
				.end((err, res) => {
					assert.equal(res.status, 404);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.error, "Запись не найдена");
					done();
				})
		});
	});
	describe('Put request test', () => {
		it('Update envelope', (done) => {
			chai
				.request(server)
				.keepOpen()
				.put(`/api/envelopes/${idToDelete}`)
				.send({
					title: 'Updated Test Envelope',
					balance: 1200.55
				})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.title, 'Updated Test Envelope');
					assert.equal(res.body.balance, 1200.55);
					done();
				})
		});
		it('Update envelope without title', (done) => {
			chai
				.request(server)
				.keepOpen()
				.put(`/api/envelopes/${idToDelete}`)
				.send({
					balance: 1200.55
				})
				.end((err, res) => {
					assert.equal(res.status, 400);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.error, 'Не указано название для редактирования envelope');
					done();
				})
		});
		it('Update envelope without balance', (done) => {
			chai
				.request(server)
				.keepOpen()
				.put(`/api/envelopes/${idToDelete}`)
				.send({
					title: 'Updated Test Envelope',
				})
				.end((err, res) => {
					assert.equal(res.status, 400);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.error, 'Не указано баланс для редактирования envelope');
					done();
				})
		});
		it('Update envelope with invalid id', (done) => {
			chai
				.request(server)
				.keepOpen()
				.put(`/api/envelopes/90999`)
				.send({
					title: 'Updated Test Envelope',
					balance: 1200.55
				})
				.end((err, res) => {
					assert.equal(res.status, 404);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.error, 'Запись не найдена');
					done();
				})
		});
	})
	describe('Envelope transaction test', () => {
		it('Create transaction', (done) => {
			chai
				.request(server)
				.keepOpen()
				.post(`/api/envelopes/${idToDelete}/transactions`)
				.send({
					title: 'Test transaction',
					amount: 200
				})
				.end((err, res) => {
					assert.equal(res.status, 201);
					assert.equal(res.body.amount, 200);
					assert.equal(res.body.envelope_id, idToDelete);
					assert.equal(res.body.title, 'Test transaction');
					transactionIdToDelete = res.body.id;
					done();
				})
		})
		it('Get envelope by id after transaction', (done) => {
			chai
				.request(server)
				.keepOpen()
				.get(`/api/envelopes/${idToDelete}`)
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.title, 'Updated Test Envelope');
					assert.equal(res.body.balance, 1000.55);
					done();
				})
		});
		it('Get all transactions', (done) => {
			chai
				.request(server)
				.keepOpen()
				.get('/api/transactions')
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.equal(Array.isArray(res.body), true);
					done();
				})
		});
		it('Get transaction by id', (done) => {
			chai
				.request(server)
				.keepOpen()
				.get(`/api/transactions/${idToDelete}`)
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.title, 'Test transaction');
					assert.equal(res.body.amount, 200);
					done();
				})
		});
		it('Update transaction by id', (done) => {
			chai
				.request(server)
				.keepOpen()
				.put(`/api/transactions/${idToDelete}`)
				.send({
					title: 'Updated Test transaction',
					amount: 400
				})
				.end((err, res) => {
					console.log(res.body.error);
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.title, 'Updated Test transaction');
					assert.equal(res.body.amount, 400);
					done();
				})
		});
		it('Get envelope by id after update transaction', (done) => {
			chai
				.request(server)
				.keepOpen()
				.get(`/api/envelopes/${idToDelete}`)
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.equal(res.body.title, 'Updated Test Envelope');
					assert.equal(res.body.balance, 800.55);
					done();
				})
		});
		it('Delete an transaction by id', (done) => {
			chai
				.request(server)
				.keepOpen()
				.delete(`/api/transactions/${transactionIdToDelete}`)
				.end((err, res) => {
					assert.equal(res.status, 204);
					done();
				})
		});
		it('Delete an transaction with invalid id', (done) => {
			chai
				.request(server)
				.keepOpen()
				.delete(`/api/transactions/${transactionIdToDelete}`)
				.end((err, res) => {
					assert.equal(res.status, 404);
					assert.equal(res.body.error, "Транзакция не найдена")
					done();
				})
		});
	})
	describe('Delete request test', () => {
		it('Delete an envelope by id', (done) => {
			chai
				.request(server)
				.keepOpen()
				.delete(`/api/envelopes/${idToDelete}`)
				.end((err, res) => {
					assert.equal(res.status, 204);
					done();
				})
		});
		it('Delete an envelope with invalid id', (done) => {
			chai
				.request(server)
				.keepOpen()
				.delete(`/api/envelopes/${idToDelete}`)
				.end((err, res) => {
					assert.equal(res.status, 404);
					assert.equal(res.body.error, "Запись не найдена")
					done();
				})
		});
	})
})