import express, { Application, Request, Response } from "express";
const port: string | number = process.env.PORT || 7000;

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
	res.send("my api is up and running");
});

app.listen(port, () => {
	console.log("listening on port");
});
