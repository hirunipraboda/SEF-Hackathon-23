const express = require("express");

const {
    createTrain,
    getAllTrains,
    getTrainById,
    searchTrains,
    updateTrain,
    deleteTrain,
} = require("../controllers/trainController");

const router = express.Router();

router.get("/search", searchTrains);

router.get("/", getAllTrains);

router.get("/:id", getTrainById);

router.post("/", createTrain);

router.put("/:id", updateTrain);

router.delete("/:id", deleteTrain);

module.exports = router;