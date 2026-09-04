const Feedback = require("../models/Feedback");

// CREATE FEEDBACK
const createFeedback = async (req, res) => {
    try {
        const {
            trainName,
            trainNumber,
            rating,
            category,
            comment
        } = req.body;

        const feedback = await Feedback.create({
            trainName,
            trainNumber,
            rating,
            category,
            comment
        });

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            data: feedback
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL FEEDBACK
const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: feedback.length,
            data: feedback
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ONE FEEDBACK
const getFeedbackById = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found"
            });
        }

        res.status(200).json({
            success: true,
            data: feedback
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE FEEDBACK
const updateFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Feedback updated successfully",
            data: feedback
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE FEEDBACK
const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(
            req.params.id
        );

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Feedback deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET FEEDBACK BY TRAIN NUMBER
const getFeedbackByTrain = async (req, res) => {
    try {
        const feedback = await Feedback.find({
            trainNumber: req.params.trainNumber
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: feedback.length,
            data: feedback
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET AVERAGE RATING FOR A TRAIN
const getAverageRating = async (req, res) => {
    try {
        const trainNumber = req.params.trainNumber;

        const result = await Feedback.aggregate([
            {
                $match: {
                    trainNumber: trainNumber
                }
            },
            {
                $group: {
                    _id: "$trainNumber",
                    averageRating: {
                        $avg: "$rating"
                    },
                    totalReviews: {
                        $sum: 1
                    }
                }
            }
        ]);

        if (result.length === 0) {
            return res.status(200).json({
                success: true,
                averageRating: 0,
                totalReviews: 0
            });
        }

        res.status(200).json({
            success: true,
            averageRating:
                Math.round(result[0].averageRating * 10) / 10,
            totalReviews: result[0].totalReviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createFeedback,
    getAllFeedback,
    getFeedbackById,
    updateFeedback,
    deleteFeedback,
    getFeedbackByTrain,
    getAverageRating
};