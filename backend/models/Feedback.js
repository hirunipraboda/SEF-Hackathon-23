const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        trainName: {
            type: String,
            required: [true, "Train name is required"],
            trim: true
        },

        trainNumber: {
            type: String,
            required: [true, "Train number is required"],
            trim: true
        },

        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating cannot be more than 5"]
        },

        category: {
            type: String,
            required: [true, "Category is required"],
            enum: [
                "Cleanliness",
                "Punctuality",
                "Comfort",
                "Staff Service",
                "Safety",
                "Other"
            ]
        },

        comment: {
            type: String,
            required: [true, "Comment is required"],
            minlength: [5, "Comment must contain at least 5 characters"],
            maxlength: [500, "Comment cannot exceed 500 characters"],
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Feedback", feedbackSchema);