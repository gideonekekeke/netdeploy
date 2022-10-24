import express from "express";
const router = express.Router();
import { follow, unfollow } from "../controllers/FollowerController";

router.route("/:followerID/:followingID/startfollow").patch(follow);
router.route("/:followerID/:followingID/unfollow").patch(unfollow);

export default router;
