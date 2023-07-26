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
			unique: true,
			notNull: true
		},
		balance: {
			type: 'numeric(1000,2)',
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
		title: {
			type: 'varchar(255)',
			notNull: true
		},
		amount: {
			type: 'numeric(1000,2)',
			notNull: true,
		},
		envelope_id: {
			type: 'integer',
			notNull: true,
			references: '"envelopes"',
			onDelete: 'cascade'
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
