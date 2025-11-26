// routes/jastipRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/jastipController");

// SAFE STATIC ROUTES
router.get("/", controller.getAll);

// ID ROUTES — aman, tidak bentrok dengan "/"
router.get("/id/:id", controller.getOne);
router.put("/id/:id", controller.update);
router.delete("/id/:id", controller.remove);

router.post("/", controller.create);

module.exports = router;
