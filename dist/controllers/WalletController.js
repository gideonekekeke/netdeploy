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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWalletTransaction = exports.getWallet = exports.createWallet = void 0;
const UserModel_1 = __importDefault(require("../Models/UserModel"));
const WalletModel_1 = __importDefault(require("../Models/WalletModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const createWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { totalBalance, token, credit, debit, paymentDescription } = req.body;
        const getUser = yield UserModel_1.default.findById(req.params.id);
        const getWallet = yield WalletModel_1.default.create({
            _id: getUser === null || getUser === void 0 ? void 0 : getUser._id,
            totalBalance: 100,
            credit: 0,
            debit: 0,
            token: getUser === null || getUser === void 0 ? void 0 : getUser.accesstoken,
            paymentDescription: "",
        });
        getUser === null || getUser === void 0 ? void 0 : getUser.wallet.push(new mongoose_1.default.Types.ObjectId(getWallet._id));
        getUser === null || getUser === void 0 ? void 0 : getUser.save();
        return res.status(200).json({
            message: "wallet created",
            data: getWallet,
        });
    }
    catch (err) {
        return res.status(404).json({ message: err });
    }
});
exports.createWallet = createWallet;
const getWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUser = yield WalletModel_1.default.findById(req.params.id);
        return res.status(200).json({
            message: "successfull",
            data: getUser,
        });
    }
    catch (err) {
        return res.status(404).json({ message: err });
    }
});
exports.getWallet = getWallet;
const createWalletTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, paymentDescription, token } = req.body;
        const getUser = yield UserModel_1.default.findById(req.params.myID);
        const myWallet = yield WalletModel_1.default.findById(req.params.myID);
        const yourWallet = yield WalletModel_1.default.findById(req.params.recieverID);
        if ((getUser === null || getUser === void 0 ? void 0 : getUser.accesstoken) === token) {
            if ((myWallet === null || myWallet === void 0 ? void 0 : myWallet.totalBalance) <= 0 || amount > (myWallet === null || myWallet === void 0 ? void 0 : myWallet.totalBalance)) {
                return res.status(200).json({
                    message: "Your account Balance is insufficient to complete this transaction",
                });
            }
            else {
                yield WalletModel_1.default.findByIdAndUpdate(req.params.myID, {
                    totalBalance: (myWallet === null || myWallet === void 0 ? void 0 : myWallet.totalBalance) - amount,
                    debit: amount,
                    paymentDescription,
                    credit: 0,
                }, {
                    new: true,
                });
            }
            yield WalletModel_1.default.findByIdAndUpdate(req.params.recieverID, {
                totalBalance: (yourWallet === null || yourWallet === void 0 ? void 0 : yourWallet.totalBalance) + amount,
                credit: amount,
                debit: 0,
                paymentDescription,
            }, {
                new: true,
            });
        }
        return res.status(200).json({
            message: `Transaction of ${amount} was successfull`,
            // data: getingWllet,
        });
    }
    catch (err) {
        return res.status(404).json({ message: err });
    }
});
exports.createWalletTransaction = createWalletTransaction;
