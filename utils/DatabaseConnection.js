import { Sequelize } from 'sequelize';
import {
    DATABASE_URL,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_SSL,
    DB_USER,
} from './env.js';

const useSsl = DB_SSL === 'true';

const sequelize = DATABASE_URL
    ? new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: useSsl
            ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            }
            : {},
    })
    : new Sequelize(DB_NAME || 'testDB', DB_USER || 'rohan', DB_PASSWORD || '', {
        host: DB_HOST,
        dialect: 'postgres',
        port: Number(DB_PORT),
        logging: false,
        dialectOptions: useSsl
            ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            }
            : {},
    });

(async ()=>{ 
    try {
        await sequelize.authenticate()
        console.log('Connection to PostgreSQL Database is successful')
    } catch (error) {
        console.log('Database connection error:', error)
    }
})();

export default sequelize;
