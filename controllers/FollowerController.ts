import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import followModel from "../Models/Followers";
import followingModel from "../Models/Following";
import { Response, Request } from "express";
import cypto from "crypto";
import userModel from "../Models/UserModel";

export const follow = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		await userModel.findByIdAndUpdate(
			req.params.followingID,
			{
				$push: {
					followers: req.params.followerID,
				},
			},
			{ new: true },
		);

		await userModel.findByIdAndUpdate(
			req.params.followerID,
			{
				$push: {
					following: req.params.followingID,
				},
			},
			{ new: true },
		);
		return res.status(200).json({
			message: "you has started following this person",
		});
	} catch (err) {
		return res.status(404).json({ message: err });
	}
};
export const unfollow = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		await userModel.findByIdAndUpdate(
			req.params.followingID,
			{
				$pull: {
					followers: req.params.followerID,
				},
			},
			{ new: true },
		);

		await userModel.findByIdAndUpdate(
			req.params.followerID,
			{
				$pull: {
					following: req.params.followingID,
				},
			},
			{ new: true },
		);
		return res.status(200).json({
			message: "you have unfollow this person",
		});
	} catch (err) {
		return res.status(404).json({ message: err });
	}
};
