import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../Models/UserModel";
import { Response, Request } from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";
import UserModel from "../Models/UserModel";

const transporter = nodemailer.createTransport({
	service: "gmail",
	port: 587,
	auth: {
		user: "Gideonekeke64@gmail.com",
		pass: "sgczftichnkcqksx",
	},
});

export const getUsers = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const alUsers = await userModel
			.find({})
			.sort({
				createdAt: -1,
			})
			.populate("wallet");
		return res.status(200).json({
			message: "successfull",
			data: alUsers,
		});
	} catch (err) {
		return res.status(404).json({ message: err });
	}
};

export const singleUser = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const findUser = await userModel.findById(req.params.id);
		return res.status(200).json({
			message: "successfull",
			data: findUser,
		});
	} catch (err) {
		return res.status(404).json({ message: err });
	}
};
export const updateUser = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const { userName, fullName } = req.body;
		const findUser = await userModel.findByIdAndUpdate(
			req.params.id,
			{
				userName,
				fullName,
			},
			{ new: true },
		);
		return res.status(200).json({
			message: "successfull",
			data: findUser,
		});
	} catch (err) {
		return res.status(404).json({ message: err });
	}
};
export const removeUser = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const findUser = await userModel.findByIdAndRemove(req.params.id);
		return res.status(200).json({
			message: "successfull",
			data: findUser,
		});
	} catch (err) {
		return res.status(404).json({ message: err });
	}
};
export const createUser = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const { userName, fullName, email, password } = req.body;
		const numb = Math.floor(1000 + Math.random() * 9000);

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const generateToken: string = crypto.randomBytes(32).toString("hex");
		const getToken = jwt.sign(
			{ generateToken },
			"$Gtgutjtjt-5ydnfhdfg$f0-77r#77d$hjfdbfbf",
			{ expiresIn: "1d" },
		);

		const User = await userModel.create({
			userName,
			fullName,
			email,
			accountNumber: Math.floor((Math.random() * Date.now()) / 100),
			password: hash,
			verified: false,
			verifiedToken: getToken,
			accesstoken: numb,
		});

		const file = path.join(__dirname, "../views/home.ejs");

		ejs.renderFile(
			file,
			{ name: User?.fullName, tok: User?._id },
			function (err, data) {
				if (err) {
					console.log(err);
				} else {
					var mainOptions = {
						from: '"Tester" Gideonekeke64@gmail.com',
						to: email,
						subject: "AJWALLET-VERIFY",
						html: data,
					};
					// console.log("html data ======================>", mainOptions.html);
					transporter.sendMail(mainOptions, function (err, info) {
						if (err) {
							console.log(err);
						} else {
							console.log("Message sent: " + info.response);
						}
					});
				}
			},
		);

		return res.status(200).json({
			message: "Please check your mail to verify",
			data: User,
		});
	} catch (err) {
		return res.status(404).json({ message: err });
	}
};

export const loginUser = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		const findUser = await userModel.findOne({ email });

		if (findUser) {
			if (findUser?.verifiedToken === "" && findUser?.verified === true) {
				const checkPassword = await bcrypt.compare(password, findUser.password);

				if (checkPassword) {
					const { ...info } = findUser._doc;

					return res.status(200).json({
						message: `Welcome back ${findUser.userName}`,
						data: info,
						token: jwt.sign(
							{ _id: findUser?._id },
							"$Gtgutjtjt-5ydnfhdfg$f0-77r#77d$hjfdbfbf",
							{ expiresIn: "20m" },
						),
					});
				} else {
					return res.status(404).json("password is incorrect");
				}
			} else {
				const file = path.join(__dirname, "../views/home.ejs");

				ejs.renderFile(
					file,
					{ name: findUser?.fullName, tok: findUser?._id },
					function (err, data) {
						if (err) {
							console.log(err);
						} else {
							var mainOptions = {
								from: '"Tester" Gideonekeke64@gmail.com',
								to: email,
								subject: "AJWALLET-VERIFY",
								html: data,
							};
							// console.log("html data ======================>", mainOptions.html);
							transporter.sendMail(mainOptions, function (err, info) {
								if (err) {
									console.log(err);
								} else {
									console.log("Message sent: " + info.response);
								}
							});
						}
					},
				);

				return res.status(200).json({
					message: "Please check your mail to verify",
				});
			}
		} else {
			return res.status(404).json("user with this email does not exists");
		}
	} catch (err) {
		return res.status(404).json({ message: err });
	}
};

export const verifyUser = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		await UserModel.findByIdAndUpdate(
			req.params.id,
			{
				verified: true,
				verifiedToken: "",
			},
			{
				new: true,
			},
		);

		return res.status(200).json({
			message: "verfication completed",
		});
	} catch (err) {
		return res.status(404).json({ message: err });
	}
};

export const queryData = async (req: Request, res: Response) => {
	try {
		const search = req.query;
		const finding = await userModel.findOne(search);
		res.status(200).send(finding);
	} catch (err) {
		return res.status(404).json({ message: err });
	}
};

// forgot password

export const forgotPassword = async (req: Request, res: Response) => {
	const { email } = req.body;
	const findUser = await userModel.findOne({ email });
	console.log(findUser);
	const user = await userModel.findById(req.params.id);

	const generateToken: string = crypto.randomBytes(32).toString("hex");
	const getToken = jwt.sign(
		{ generateToken },
		"$Gtgutjtjt-5ydnfhdfg$f0-77r#77d$hjfdbfbf",
		{ expiresIn: "1d" },
	);

	try {
		if (findUser?.verified && findUser?.verifiedToken === "") {
			if (findUser) {
				// await userModel.findByIdAndUpdate(
				// 	findUser?._id,
				// 	{
				// 		verifiedToken: getToken,
				// 	},
				// 	{ new: true },
				// );

				const file = path.join(__dirname, "../views/forgotPage.ejs");

				ejs.renderFile(file, { tok: findUser?._id }, function (err, data) {
					if (err) {
						console.log(err);
					} else {
						var mainOptions = {
							from: '"Tester" Gideonekeke64@gmail.com',
							to: email,
							subject: "AJWALLET-VERIFY",
							html: data,
						};
						// console.log("html data ======================>", mainOptions.html);
						transporter.sendMail(mainOptions, function (err, info) {
							if (err) {
								console.log(err);
							} else {
								console.log("Message sent: " + info.response);
							}
						});
					}
				});

				return res.status(200).json({
					message: "Please check your email to reset your password",
				});
			} else {
				return res.status(404).json({ message: "User is Invalid " });
			}
		} else {
			return res.status(404).json({ message: "User does not exit " });
		}
	} catch (err) {
		return res.status(404).json({ message: err });
	}
};

//reseting password
export const resetPassword = async (req: Request, res: Response) => {
	try {
		const { password } = req.body;

		const user = await userModel.findById(req.params.id);
		const salt = await bcrypt.genSalt(10);
		const hashedNew = await bcrypt.hash(password, salt);

		if (user) {
			await userModel.findByIdAndUpdate(user._id, {
				password: hashedNew,
			});
		} else {
			return res.status(404).json({
				message: "user not found",
			});
		}
		return res.status(200).json({ message: "passoword has been changed " });
	} catch (err) {
		return res.status(404).json({ message: err });
	}
};
