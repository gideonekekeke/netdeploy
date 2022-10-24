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
exports.createHistory = void 0;
const UserModel_1 = __importDefault(require("../Models/UserModel"));
const HistoryMode_1 = __importDefault(require("../Models/HistoryMode"));
const WalletModel_1 = __importDefault(require("../Models/WalletModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const createHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield WalletModel_1.default.findById(req.params.id);
        const time = Date.now() + Math.floor(Math.random() * Date.now());
        // sender user
        const getUser = yield UserModel_1.default.findById(req.params.myID);
        const myWallet = yield WalletModel_1.default.findById(req.params.myID);
        // reciever user
        const yourWallet = yield WalletModel_1.default.findById(req.params.recieverID);
        const yourUser = yield UserModel_1.default.findById(req.params.recieverID);
        if (getUser) {
            const firstTrans = yield HistoryMode_1.default.create({
                amount: (myWallet === null || myWallet === void 0 ? void 0 : myWallet.credit) === 0 ? myWallet === null || myWallet === void 0 ? void 0 : myWallet.debit : myWallet === null || myWallet === void 0 ? void 0 : myWallet.credit,
                sentTo: yourUser === null || yourUser === void 0 ? void 0 : yourUser.fullName,
                recieviedForm: getUser === null || getUser === void 0 ? void 0 : getUser.fullName,
                transactionDescription: myWallet === null || myWallet === void 0 ? void 0 : myWallet.paymentDescription,
                transactionsReference: time,
                availableBalance: myWallet === null || myWallet === void 0 ? void 0 : myWallet.totalBalance,
                paymentType: (myWallet === null || myWallet === void 0 ? void 0 : myWallet.credit) === 0 ? "debit" : "credit",
            });
            myWallet === null || myWallet === void 0 ? void 0 : myWallet.history.push(new mongoose_1.default.Types.ObjectId(firstTrans._id));
            myWallet === null || myWallet === void 0 ? void 0 : myWallet.save();
        }
        if (yourUser) {
            const secondTrans = yield HistoryMode_1.default.create({
                amount: (yourWallet === null || yourWallet === void 0 ? void 0 : yourWallet.debit) === 0 ? yourWallet === null || yourWallet === void 0 ? void 0 : yourWallet.credit : yourWallet === null || yourWallet === void 0 ? void 0 : yourWallet.debit,
                recieviedForm: getUser === null || getUser === void 0 ? void 0 : getUser.fullName,
                transactionDescription: yourWallet === null || yourWallet === void 0 ? void 0 : yourWallet.paymentDescription,
                transactionsReference: time,
                availableBalance: yourWallet === null || yourWallet === void 0 ? void 0 : yourWallet.totalBalance,
                paymentType: (yourWallet === null || yourWallet === void 0 ? void 0 : yourWallet.debit) === 0 ? "credit" : "debit",
            });
            yourWallet === null || yourWallet === void 0 ? void 0 : yourWallet.history.push(new mongoose_1.default.Types.ObjectId(secondTrans._id));
            yourWallet === null || yourWallet === void 0 ? void 0 : yourWallet.save();
        }
        return res.status(200).json({
            message: "transaction created successfully",
        });
    }
    catch (err) {
        return res.status(404).json({ message: err });
    }
});
exports.createHistory = createHistory;
