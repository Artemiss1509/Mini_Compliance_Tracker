import { DataTypes } from "sequelize";
import sequelize from "../utils/DatabaseConnection.js";
import { title } from "node:process";

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
}, {
    timestamps: true,
});

export default Task;