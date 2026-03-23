import { Client, Task } from "../models/associations.model.js";

const VALID_STATUSES = ["pending", "completed"];

const normalizeString = (value) => value?.trim();

const normalizeTaskPayload = (payload = {}) => {
    const title = normalizeString(payload.title);
    const description = normalizeString(payload.description) || "";
    const category = normalizeString(payload.category);
    const status = normalizeString(payload.status)?.toLowerCase() || "pending";
    const priority = normalizeString(payload.priority)?.toLowerCase() || "medium";
    const dueDate = payload.dueDate;
    const clientId = Number(payload.clientId);

    return {
        title,
        description,
        category,
        status,
        priority,
        dueDate,
        clientId,
    };
};

const validateTaskPayload = ({ title, category, status, dueDate, clientId }) => {
    if (!Number.isInteger(clientId) || clientId <= 0) {
        return "A valid client is required.";
    }

    if (!title) {
        return "Task title is required.";
    }

    if (!category) {
        return "Task category is required.";
    }

    if (!VALID_STATUSES.includes(status)) {
        return "Status must be pending or completed.";
    }

    if (!dueDate || Number.isNaN(new Date(dueDate).getTime())) {
        return "A valid due date is required.";
    }

    return null;
};

const getOwnedClient = async (clientId, userId) => Client.findOne({
    where: {
        id: clientId,
        userId,
    },
});

export const getTasks = async (req, res) => {
    try {
        const clientId = Number(req.query.clientId);
        const status = normalizeString(req.query.status)?.toLowerCase();
        const category = normalizeString(req.query.category);

        if (!Number.isInteger(clientId) || clientId <= 0) {
            return res.status(400).json({ message: "clientId query parameter is required." });
        }

        const client = await getOwnedClient(clientId, req.user.id);
        if (!client) {
            return res.status(404).json({ message: "Client not found." });
        }

        const where = { clientId };

        if (status && status !== "all") {
            if (!VALID_STATUSES.includes(status)) {
                return res.status(400).json({ message: "Invalid status filter." });
            }
            where.status = status;
        }

        if (category && category !== "all") {
            where.category = category;
        }

        const tasks = await Task.findAll({
            where,
            order: [["dueDate", "ASC"], ["createdAt", "DESC"]],
        });

        res.status(200).json({ message: "Tasks retrieved successfully", tasks });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving tasks", error: error.message });
    }
};

export const createTask = async (req, res) => {
    try {
        const taskPayload = normalizeTaskPayload(req.body);
        const validationError = validateTaskPayload(taskPayload);

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const client = await getOwnedClient(taskPayload.clientId, req.user.id);
        if (!client) {
            return res.status(404).json({ message: "Client not found." });
        }

        const task = await Task.create(taskPayload);
        res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Error creating task", error: error.message });
    }
};

export const updateTaskStatus = async (req, res) => {
    try {
        const taskId = Number(req.params.taskId);
        const status = normalizeString(req.body.status)?.toLowerCase();

        if (!Number.isInteger(taskId) || taskId <= 0) {
            return res.status(400).json({ message: "A valid task id is required." });
        }

        if (!VALID_STATUSES.includes(status)) {
            return res.status(400).json({ message: "Status must be pending or completed." });
        }

        const task = await Task.findOne({
            where: { id: taskId },
            include: [{
                model: Client,
                as: "client",
                where: {
                    userId: req.user.id,
                },
                attributes: ["id", "companyName"],
            }],
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        task.status = status;
        await task.save();

        res.status(200).json({ message: "Task status updated successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Error updating task status", error: error.message });
    }
};
