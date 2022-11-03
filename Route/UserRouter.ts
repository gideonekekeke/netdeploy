import {
	createUser,
	forgotPassword,
	loginUser,
	queryData,
	resetPassword,
	verifyUser,
} from "./../controllers/userController";
import express from "express";
const router = express.Router();
import {
	getUsers,
	singleUser,
	updateUser,
	removeUser,
} from "../controllers/userController";

router.route("/").get(getUsers);
router.route("/create").post(createUser);
router.route("/login").post(loginUser);
router.route("/quer").get(queryData);
router.route("/:id").get(singleUser);
router.route("/update/:id").patch(updateUser);
router.route("/verify/:id").get(verifyUser);
router.route("/remove/:id").patch(removeUser);
router.route("/fogotpass").post(forgotPassword);
router.route("/reset/:id").post(resetPassword);

export default router;
