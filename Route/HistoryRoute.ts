import express from "express";
const router = express.Router();
import { createHistory } from "../controllers/HistoryController";

router.route("/:myID/:recieverID/history").patch(createHistory);

export default router;
