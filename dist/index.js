"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const port = process.env.PORT || 5000;
const mongoose_1 = __importDefault(require("mongoose"));
const URL = "mongodb://localhost/AJwalletDB";
const UserRouter_1 = __importDefault(require("./Route/UserRouter"));
const FollowRoute_1 = __importDefault(require("./Route/FollowRoute"));
const WalletRoute_1 = __importDefault(require("./Route/WalletRoute"));
const HistoryRoute_1 = __importDefault(require("./Route/HistoryRoute"));
const app = (0, express_1.default)();
mongoose_1.default
    .connect(URL)
    .then(() => {
    console.log("database is connected");
})
    .catch((err) => {
    console.log("an error occurred: " + err);
});
app.get("/", (req, res) => {
    res.status(200).json({ message: "we are ready" });
});
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.status(200).json({ message: "api is ready for consumption" });
});
app.use("/api/users", UserRouter_1.default);
app.use("/api/follow", FollowRoute_1.default);
app.use("/api/wallet", WalletRoute_1.default);
app.use("/api/history", HistoryRoute_1.default);
app.listen(port, () => {
    console.log(`listening on ${port}`);
});
