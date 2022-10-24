"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const historyModel = new mongoose_1.default.Schema({
    wallet: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "wallets",
    },
    sentTo: {
        type: String,
    },
    recieviedForm: {
        type: String,
    },
    transactionDescription: {
        type: String,
    },
    paymentType: {
        type: String,
    },
    transactionsReference: {
        type: Number,
    },
    availableBalance: {
        type: Number,
    },
    amount: {
        type: Number,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("histories", historyModel);
