"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const port = process.env.PORT || 7000;
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    res.send("my api is up and running");
});
app.listen(port, () => {
    console.log("listening on port");
});
