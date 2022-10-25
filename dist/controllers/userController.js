"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.queryData = exports.verifyUser = exports.loginUser = exports.createUser = exports.removeUser = exports.updateUser = exports.singleUser = exports.getUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = __importDefault(require("../Models/UserModel"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const UserModel_2 = __importDefault(require("../Models/UserModel"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
    },
});
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const alUsers = yield UserModel_1.default
            .find({})
            .sort({
            createdAt: -1,
        })
            .populate("wallet");
        return res.status(200).json({
            message: "successfull",
            data: alUsers,
        });
    }
    catch (err) {
        return res.status(404).json({ message: err });
    }
});
exports.getUsers = getUsers;
const singleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findUser = yield UserModel_1.default.findById(req.params.id);
        return res.status(200).json({
            message: "successfull",
            data: findUser,
        });
    }
    catch (err) {
        return res.status(404).json({ message: err });
    }
});
exports.singleUser = singleUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, fullName } = req.body;
        const findUser = yield UserModel_1.default.findByIdAndUpdate(req.params.id, {
            userName,
            fullName,
        }, { new: true });
        return res.status(200).json({
            message: "successfull",
            data: findUser,
        });
    }
    catch (err) {
        return res.status(404).json({ message: err });
    }
});
exports.updateUser = updateUser;
const removeUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findUser = yield UserModel_1.default.findByIdAndRemove(req.params.id);
        return res.status(200).json({
            message: "successfull",
            data: findUser,
        });
    }
    catch (err) {
        return res.status(404).json({ message: err });
    }
});
exports.removeUser = removeUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, fullName, email, password } = req.body;
        const numb = Math.floor(1000 + Math.random() * 9000);
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const generateToken = crypto_1.default.randomBytes(32).toString("hex");
        const getToken = jsonwebtoken_1.default.sign({ generateToken }, `${process.env.SECRETE_USER}`, { expiresIn: "1d" });
        const User = yield UserModel_1.default.create({
            userName,
            fullName,
            email,
            accountNumber: Math.floor((Math.random() * Date.now()) / 100),
            password: hash,
            verified: false,
            verifiedToken: getToken,
            accesstoken: numb,
        });
        const file = path_1.default.join(__dirname, "../views/home.ejs");
        ejs_1.default.renderFile(file, { name: User === null || User === void 0 ? void 0 : User.fullName, tok: User === null || User === void 0 ? void 0 : User._id }, function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
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
                    }
                    else {
                        console.log("Message sent: " + info.response);
                    }
                });
            }
        });
        return res.status(200).json({
            message: "Please check your mail to verify",
        });
    }
    catch (err) {
        return res.status(404).json({ message: err });
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const findUser = yield UserModel_1.default.findOne({ email });
        if (findUser) {
            if ((findUser === null || findUser === void 0 ? void 0 : findUser.verifiedToken) === "" && (findUser === null || findUser === void 0 ? void 0 : findUser.verified) === true) {
                const checkPassword = yield bcrypt_1.default.compare(password, findUser.password);
                if (checkPassword) {
                    const info = __rest(findUser._doc, []);
                    return res.status(200).json({
                        message: `Welcome back ${findUser.userName}`,
                        data: info,
                        token: jsonwebtoken_1.default.sign({ _id: findUser === null || findUser === void 0 ? void 0 : findUser._id }, `${process.env.SECRETE_USER}`, {
                            expiresIn: "20m",
                        }),
                    });
                }
                else {
                    return res.status(404).json("password is incorrect");
                }
            }
            else {
                const file = path_1.default.join(__dirname, "../views/home.ejs");
                ejs_1.default.renderFile(file, { name: findUser === null || findUser === void 0 ? void 0 : findUser.fullName, tok: findUser === null || findUser === void 0 ? void 0 : findUser._id }, function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                    else {
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
                            }
                            else {
                                console.log("Message sent: " + info.response);
                            }
                        });
                    }
                });
                return res.status(200).json({
                    message: "Please check your mail to verify",
                });
            }
        }
        else {
            return res.status(404).json("user with this email does not exists");
        }
    }
    catch (err) {
        return res.status(404).json({ message: err });
    }
});
exports.loginUser = loginUser;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield UserModel_2.default.findByIdAndUpdate(req.params.id, {
            verified: true,
            verifiedToken: "",
        }, {
            new: true,
        });
        return res.status(200).json({
            message: "verfication completed",
        });
    }
    catch (err) {
        return res.status(404).json({ message: err });
    }
});
exports.verifyUser = verifyUser;
const queryData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const search = req.query;
    const finding = yield UserModel_1.default.findOne(search);
    res.status(200).send(finding);
});
exports.queryData = queryData;
// forgot password
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const findUser = yield UserModel_1.default.findOne({ email });
    console.log(findUser);
    const user = yield UserModel_1.default.findById(req.params.id);
    const generateToken = crypto_1.default.randomBytes(32).toString("hex");
    const getToken = jsonwebtoken_1.default.sign({ generateToken }, `${process.env.SECRETE_USER}`, {
        expiresIn: "1d",
    });
    try {
        if ((findUser === null || findUser === void 0 ? void 0 : findUser.verified) && (findUser === null || findUser === void 0 ? void 0 : findUser.verifiedToken) === "") {
            if (findUser) {
                // await userModel.findByIdAndUpdate(
                // 	findUser?._id,
                // 	{
                // 		verifiedToken: getToken,
                // 	},
                // 	{ new: true },
                // );
                const file = path_1.default.join(__dirname, "../views/forgotPage.ejs");
                ejs_1.default.renderFile(file, { tok: findUser === null || findUser === void 0 ? void 0 : findUser._id }, function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                    else {
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
                            }
                            else {
                                console.log("Message sent: " + info.response);
                            }
                        });
                    }
                });
                return res.status(200).json({
                    message: "Please check your email to reset your password",
                });
            }
            else {
                return res.status(404).json({ message: "User is Invalid " });
            }
        }
        else {
            return res.status(404).json({ message: "User does not exit " });
        }
    }
    catch (err) {
        return res.status(404).json({ message: err });
    }
});
exports.forgotPassword = forgotPassword;
//reseting password
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        const user = yield UserModel_1.default.findById(req.params.id);
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedNew = yield bcrypt_1.default.hash(password, salt);
        if (user) {
            if (user._id && req.params.token) {
                yield UserModel_1.default.findByIdAndUpdate(user._id, {
                    password: hashedNew,
                });
            }
            else {
                return res.status(404).json({
                    message: "user not found",
                });
            }
        }
        else {
            return res.status(404).json({
                message: "user not found",
            });
        }
        return res.status(404).json({ message: "passoword has been changed " });
    }
    catch (err) {
        return res.status(404).json({ message: err });
    }
});
exports.resetPassword = resetPassword;
