import express from "express";
const router = express.Router();
import {
	createWallet,
	getWallet,
	createWalletTransaction,
} from "../controllers/WalletController";
import { createHistory } from "../controllers/HistoryController";

router.route("/:id/create").post(createWallet);
router.route("/:id/wallet").get(getWallet);
router.route("/:myID/:recieverID/send").patch(createWalletTransaction);
export default router;
