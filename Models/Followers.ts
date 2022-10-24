import mongoose from "mongoose";

interface User {
	user: {};
}

interface SchemaData extends User, mongoose.Document {}

const followerModel = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},
	},
	{ timestamps: true },
);

export default mongoose.model<SchemaData>("followers", followerModel);
