import Client from "../models/client.model.js";


export const createClient = async (req, res) => {
    try {
        const { company, country, entity } = req.body;

        if (!company || !country || !entity) {
            return res.status(400).json({ message: "Company, country, and entity type are required." });
        }

        const newClient = await Client.create({
            companyName: company.trim(),
            country: country.trim(),
            entityType: entity.trim(),
            userId: req.user.id,
        });

        res.status(201).json({ message: "Client created successfully", client: newClient });
    } catch (error) {
        res.status(500).json({ message: "Client not created. Error", error: error.message });
    }
};

export const getClients = async (req, res) => {
    try {
        const clients = await Client.findAll({
            where: {
                userId: req.user.id,
            },
            order: [["companyName", "ASC"]],
        });

        res.status(200).json({ message: "Clients retrieved successfully", clients });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving clients", error: error.message });
    }
};
