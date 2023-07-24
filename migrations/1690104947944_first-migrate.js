/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
	pgm.createTable('envelopes', {
		id: {
			type: 'serial',
			primaryKey: true
		},
		title: {
			type: 'varchar(255)',
			notNull: true
		},
		balance: {
			type: 'real',
			notNull: true,
			default: 0
		}
	}, {
		ifNotExists: true
	})
	pgm.createTable('transactions', {
		id: {
			type: 'serial',
			primaryKey: true
		},
		amount: {
			type: 'real',
			notNull: true,
		},
		sender_envelope_id: {
			type: 'integer',
			notNull: true,
			references: '"envelopes"',
		},
		recipient_envelope_id: {
			type: 'integer',
			notNull: true,
			references: '"envelopes"',
		},
		created_At: {
			type: 'timestamp',
			notNull: true,
			default: pgm.func('current_timestamp'),
		},
		updatedAt: {
			type: 'timestamp',
			notNull: true,
			default: pgm.func('current_timestamp'),
		}
	}, {
		ifNotExists: true
	})
};

exports.down = pgm => { };
