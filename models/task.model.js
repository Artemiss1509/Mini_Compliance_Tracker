import { DataTypes } from "sequelize";
import sequelize from "../utils/DatabaseConnection.js";
import Client from "./client.model.js";

const Task = sequelize.define("Task", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
    },
    priority: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'medium',
    },
    clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Client,
            key: "id",
        },
    },
}, {
    timestamps: true,
});

export default Task;
