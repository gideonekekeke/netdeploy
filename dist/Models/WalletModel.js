"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const walletModel = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
    },
    totalBalance: {
        type: Number,
    },
    token: {
        type: Number,
    },
    credit: {
        type: Number,
    },
    debit: {
        type: Number,
    },
    amount: {
        type: Number,
    },
    paymentDescription: {
        type: String,
    },
    history: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "histories",
        },
    ],
}, { timestamps: true });
exports.default = mongoose_1.default.model("wallets", walletModel);
