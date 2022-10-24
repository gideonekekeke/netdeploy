import "dotenv/config";
import express, { Response, Request, Application } from "express";
const port: number | string = process.env.PORT || 5000;
import mongoose from "mongoose";
const URL: string = "mongodb://localhost/AJwalletDB";

import user from "./Route/UserRouter";
import fol from "./Route/FollowRoute";
import wallet from "./Route/WalletRoute";
import history from "./Route/HistoryRoute";
import cors from "cors";

const app: Application = express();

mongoose
	.connect(`${process.env.MONGODB_URI}`)
	.then(() => {
		console.log("database is connected");
	})
	.catch((err: any) => {
		console.log("an error occurred: " + err);
	});

app.get("/", (req: Request, res: Response) => {
	res.status(200).json({ message: "we are ready" });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/users", user);
app.use("/api/follow", fol);
app.use("/api/wallet", wallet);
app.use("/api/history", history);

app.listen(port, () => {
	console.log(`listening on ${port}`);
});
