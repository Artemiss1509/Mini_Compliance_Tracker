import { DataTypes } from "sequelize";
import sequelize from "../utils/DatabaseConnection.js";
import { CountryCodes } from "validator/lib/isISO31661Alpha2.js";

const Client = sequelize.define("Client", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    entityType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default Client;

    