import mongoose from "mongoose";

interface User {
	user: {};
	totalBalance: number;
	token?: number;
	credit?: number;
	debit?: number;
	amount?: number;
	paymentDescription?: string;
	history: {}[];
}

interface SchemaData extends User, mongoose.Document {}

const walletModel = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
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
				type: mongoose.Schema.Types.ObjectId,
				ref: "histories",
			},
		],
	},
	{ timestamps: true },
);

export default mongoose.model<SchemaData>("wallets", walletModel);
