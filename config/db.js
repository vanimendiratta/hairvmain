const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Use SQLite for development ease, or MySQL if configured
const isProduction = process.env.NODE_ENV === 'production';

let sequelize;

if (process.env.DB_HOST && process.env.DB_USER) {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            host: process.env.DB_HOST,
            dialect: 'mysql',
            logging: false,
        }
    );
} else {
    // Fallback to SQLite
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './database.sqlite',
        logging: false
    });
}

module.exports = sequelize;
