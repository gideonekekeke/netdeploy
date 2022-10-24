import { Request, Response } from "express";
import UserModel from "../Models/UserModel";
import WalletModel from "../Models/WalletModel";
import mongoose from "mongoose";
export const createWallet = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const { totalBalance, token, credit, debit, paymentDescription } = req.body;

		const getUser = await UserModel.findById(req.params.id);
		const getWallet = await WalletModel.create({
			_id: getUser?._id,
			totalBalance: 100,
			credit: 0,
			debit: 0,
			token: getUser?.accesstoken,
			paymentDescription: "",
		});

		getUser?.wallet.push(new mongoose.Types.ObjectId(getWallet._id));

		getUser?.save();
		return res.status(200).json({
			message: "wallet created",
			data: getWallet,
		});
	} catch (err) {
		return res.status(404).json({ message: err });
	}
};
export const getWallet = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const getUser = await WalletModel.findById(req.params.id);
		return res.status(200).json({
			message: "successfull",
			data: getUser,
		});
	} catch (err) {
		return res.status(404).json({ message: err });
	}
};
export const createWalletTransaction = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const { amount, paymentDescription, token } = req.body;

		const getUser = await UserModel.findById(req.params.myID);

		const myWallet = await WalletModel.findById(req.params.myID);
		const yourWallet = await WalletModel.findById(req.params.recieverID);

		if (getUser?.accesstoken === token) {
			if (myWallet?.totalBalance! <= 0 || amount > myWallet?.totalBalance!) {
				return res.status(200).json({
					message:
						"Your account Balance is insufficient to complete this transaction",
				});
			} else {
				await WalletModel.findByIdAndUpdate(
					req.params.myID,
					{
						totalBalance: myWallet?.totalBalance! - amount,
						debit: amount,
						paymentDescription,
						credit: 0,
					},
					{
						new: true,
					},
				);
			}

			await WalletModel.findByIdAndUpdate(
				req.params.recieverID,
				{
					totalBalance: yourWallet?.totalBalance! + amount,
					credit: amount,
					debit: 0,
					paymentDescription,
				},
				{
					new: true,
				},
			);
		}

		return res.status(200).json({
			message: `Transaction of ${amount} was successfull`,
			// data: getingWllet,
		});
	} catch (err) {
		return res.status(404).json({ message: err });
	}
};
