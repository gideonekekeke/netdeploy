"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const WalletController_1 = require("../controllers/WalletController");
router.route("/:id/create").post(WalletController_1.createWallet);
router.route("/:id").get(WalletController_1.getWallet);
router.route("/:myID/:recieverID/send").patch(WalletController_1.createWalletTransaction);
exports.default = router;
