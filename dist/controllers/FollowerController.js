"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unfollow = exports.follow = void 0;
const UserModel_1 = __importDefault(require("../Models/UserModel"));
const follow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield UserModel_1.default.findByIdAndUpdate(req.params.followingID, {
            $push: {
                followers: req.params.followerID,
            },
        }, { new: true });
        yield UserModel_1.default.findByIdAndUpdate(req.params.followerID, {
            $push: {
                following: req.params.followingID,
            },
        }, { new: true });
        return res.status(200).json({
            message: "you has started following this person",
        });
    }
    catch (err) {
        return res.status(404).json({ message: err });
    }
});
exports.follow = follow;
const unfollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield UserModel_1.default.findByIdAndUpdate(req.params.followingID, {
            $pull: {
                followers: req.params.followerID,
            },
        }, { new: true });
        yield UserModel_1.default.findByIdAndUpdate(req.params.followerID, {
            $pull: {
                following: req.params.followingID,
            },
        }, { new: true });
        return res.status(200).json({
            message: "you have unfollow this person",
        });
    }
    catch (err) {
        return res.status(404).json({ message: err });
    }
});
exports.unfollow = unfollow;
