const Train = require("../models/Train");

const getAllTrains = async (req, res) => {
    try {
        const trains = await Train.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: trains.length,
            data: trains,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to load train schedules",
            error: error.message,
        });
    }
};

const createTrain = async (req, res) => {
    try {
        const train = await Train.create(req.body);

        res.status(201).json({
            success: true,
            message: "Train schedule created successfully",
            data: train,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create train schedule",
            error: error.message,
        });
    }
};

const searchTrains = async (req, res) => {
    try {
        const { from, to } = req.query;

        if (!from || !to) {
            return res.status(400).json({
                success: false,
                message: "Please provide both start station and destination",
            });
        }

        const trains = await Train.find({
            startStation: {
                $regex: from,
                $options: "i",
            },

            destinationStation: {
                $regex: to,
                $options: "i",
            },
        });

        res.status(200).json({
            success: true,
            count: trains.length,
            data: trains,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to search train schedules",
            error: error.message,
        });
    }
};

const getTrainById = async (req, res) => {
    try {
        const train = await Train.findById(req.params.id);

        if (!train) {
            return res.status(404).json({
                success: false,
                message: "Train schedule not found",
            });
        }

        res.status(200).json({
            success: true,
            data: train,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid train ID",
            error: error.message,
        });
    }
};

const updateTrain = async (req, res) => {
    try {
        const train = await Train.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!train) {
            return res.status(404).json({
                success: false,
                message: "Train schedule not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Train schedule updated successfully",
            data: train,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update train schedule",
            error: error.message,
        });
    }
};

const deleteTrain = async (req, res) => {
    try {
        const train = await Train.findByIdAndDelete(req.params.id);

        if (!train) {
            return res.status(404).json({
                success: false,
                message: "Train schedule not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Train schedule deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to delete train schedule",
            error: error.message,
        });
    }
};

module.exports = {
    createTrain,
    getAllTrains,
    getTrainById,
    searchTrains,
    updateTrain,
    deleteTrain,
};

