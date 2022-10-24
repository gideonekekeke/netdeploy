"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userModel = new mongoose_1.default.Schema({
    userName: {
        type: String,
    },
    fullName: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    accesstoken: {
        type: Number,
    },
    accountNumber: {
        type: Number,
    },
    verified: {
        type: Boolean,
    },
    verifiedToken: {
        type: String,
    },
    followers: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "followers",
        },
    ],
    following: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "followings",
        },
    ],
    wallet: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "wallets",
        },
    ],
}, { timestamps: true });
exports.default = mongoose_1.default.model("users", userModel);
