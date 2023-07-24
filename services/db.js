const { Pool } = require('pg');
const pgMigrate = require('node-pg-migrate');

const config = {
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT),
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD
}


const pool = new Pool(config);

module.exports.query = (text, params, callback) => {
	return pool.query(text, params, callback)
}

module.exports.migrate = (direction) => {
	const option = {
		databaseUrl: process.env.DATABASE_URL,
		direction: direction,
		dir: './migrations'
	}

	return pgMigrate.default(option);
}