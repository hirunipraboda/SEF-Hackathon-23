const express = require("express");

const {
    createFeedback,
    getAllFeedback,
    getFeedbackById,
    updateFeedback,
    deleteFeedback,
    getFeedbackByTrain,
    getAverageRating
} = require("../controllers/feedbackController");

const router = express.Router();

// Create feedback
router.post("/", createFeedback);

// Get all feedback
router.get("/", getAllFeedback);

// Get feedback for one train
router.get("/train/:trainNumber", getFeedbackByTrain);

// Get average rating for one train
router.get(
    "/train/:trainNumber/average",
    getAverageRating
);

// Get one feedback
router.get("/:id", getFeedbackById);

// Update feedback
router.put("/:id", updateFeedback);

// Delete feedback
router.delete("/:id", deleteFeedback);

module.exports = router;