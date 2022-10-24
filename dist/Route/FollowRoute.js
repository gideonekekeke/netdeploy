"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const FollowerController_1 = require("../controllers/FollowerController");
router.route("/:followerID/:followingID/startfollow").patch(FollowerController_1.follow);
router.route("/:followerID/:followingID/unfollow").patch(FollowerController_1.unfollow);
exports.default = router;
