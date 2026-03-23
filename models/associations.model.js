import User from "./user.model.js";
import Client from "./client.model.js";
import Task from "./task.model.js";

User.hasMany(Client, { foreignKey: 'userId', as: 'clients' });
Client.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Client.hasMany(Task, { foreignKey: 'clientId', as: 'tasks' });
Task.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

export { User, Client, Task };