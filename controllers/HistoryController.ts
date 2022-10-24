import UserModel from "../Models/UserModel";
import HistoryMode from "../Models/HistoryMode";
import WalletModel from "../Models/WalletModel";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { getWallet } from "./WalletController";

export const createHistory = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const user = await WalletModel.findById(req.params.id);

		const time = Date.now() + Math.floor(Math.random() * Date.now());

		// sender user
		const getUser = await UserModel.findById(req.params.myID);
		const myWallet = await WalletModel.findById(req.params.myID);

		// reciever user
		const yourWallet = await WalletModel.findById(req.params.recieverID);
		const yourUser = await UserModel.findById(req.params.recieverID);

		if (getUser) {
			const firstTrans = await HistoryMode.create({
				amount: myWallet?.credit === 0 ? myWallet?.debit : myWallet?.credit,
				sentTo: yourUser?.fullName,
				recieviedForm: getUser?.fullName,
				transactionDescription: myWallet?.paymentDescription,
				transactionsReference: time,
				availableBalance: myWallet?.totalBalance,
				paymentType: myWallet?.credit === 0 ? "debit" : "credit",
			});
			myWallet?.history.push(new mongoose.Types.ObjectId(firstTrans._id));
			myWallet?.save();
		}

		if (yourUser) {
			const secondTrans = await HistoryMode.create({
				amount:
					yourWallet?.debit === 0 ? yourWallet?.credit : yourWallet?.debit,
				recieviedForm: getUser?.fullName,
				transactionDescription: yourWallet?.paymentDescription,
				transactionsReference: time,
				availableBalance: yourWallet?.totalBalance,
				paymentType: yourWallet?.debit === 0 ? "credit" : "debit",
			});

			yourWallet?.history.push(new mongoose.Types.ObjectId(secondTrans._id));
			yourWallet?.save();
		}

		return res.status(200).json({
			message: "transaction created successfully",
		});
	} catch (err) {
		return res.status(404).json({ message: err });
	}
};
