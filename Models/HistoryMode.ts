import mongoose from "mongoose";

interface User {
	sentTo?: string;
	recieviedForm: string;
	amount: number;
	transactionsReference: number;
	transactionDescription: string;
	availableBalance: number;
	paymentType: string;
	wallet: {};
}

interface SchemaData extends User, mongoose.Document {}

const historyModel = new mongoose.Schema(
	{
		wallet: {
			type: mongoose.Schema.Types.ObjectId,
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
	},
	{ timestamps: true },
);

export default mongoose.model<SchemaData>("histories", historyModel);
