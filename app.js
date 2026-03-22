import express from 'express';
import sequelize from './utils/DatabaseConnection.js';
import User from './models/user.model.js';

const app = express();

app.use(express.json());

sequelize.sync().then(() => {
    console.log('Database synchronized successfully.');
}).catch((error) => {
    console.error('Error synchronizing the database:', error);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
