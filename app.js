import express from 'express';
import cors from 'cors';
import sequelize from './utils/DatabaseConnection.js';
import { User, Client, Task } from './models/associations.model.js';
import userRoutes from './routes/user.routes.js';
import clientRoutes from './routes/clients.router.js';
import taskRoutes from './routes/tasks.router.js';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
const PORT = Number(process.env.PORT) || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api', taskRoutes);



sequelize.sync({ alter: true }).then(() => {
    console.log('Database synchronized successfully.');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Error synchronizing the database:', error);
});
