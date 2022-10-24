import mongoose from "mongoose";

interface User {
	userName: string;
	fullName: string;
	email: string;
	password: string;
	accesstoken: number;
	accountNumber: number;
	verified: boolean;
	verifiedToken: string;
	token?: string;
	followers: {}[];
	following: {}[];
	wallet: {}[];
	_doc?: {};
}

interface SchemaData extends User, mongoose.Document {}

const userModel = new mongoose.Schema(
	{
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
				type: mongoose.Schema.Types.ObjectId,
				ref: "followers",
			},
		],
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "followings",
			},
		],
		wallet: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "wallets",
			},
		],
	},
	{ timestamps: true },
);

export default mongoose.model<SchemaData>("users", userModel);
