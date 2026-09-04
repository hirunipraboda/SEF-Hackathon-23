const mongoose = require("mongoose");

const trainSchema = new mongoose.Schema(
    {
        trainNumber: {
            type: String,
            required: [true, "Train number is required"],
            trim: true,
        },

        trainName: {
            type: String,
            required: [true, "Train name is required"],
            trim: true,
        },

        startStation: {
            type: String,
            required: [true, "Start station is required"],
            trim: true,
        },

        destinationStation: {
            type: String,
            required: [true, "Destination station is required"],
            trim: true,
        },

        departureTime: {
            type: String,
            required: [true, "Departure time is required"],
        },

        arrivalTime: {
            type: String,
            required: [true, "Arrival time is required"],
        },

        trainType: {
            type: String,
            required: [true, "Train type is required"],
            trim: true,
        },

        availableDays: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Train", trainSchema);
