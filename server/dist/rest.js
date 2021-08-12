var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require("express");
const { sequelize, User } = require("./models");
const app = express();
app.use(express.json());
app.post("/users", (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(req.body);
    const { name, email, role } = req.body;
    try {
        const user = yield User.create({ name, email, role });
        return res.json(user);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}));
app.get("/users", (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const users = yield User.findAll();
        return res.json(users);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
}));
app.get("/users/:uuid", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const uuid = req.params.uuid;
    try {
        const user = yield User.findOne({
            where: { uuid },
        });
        return res.json(user);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
}));
app.delete("/users/:uuid", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const uuid = req.params.uuid;
    try {
        const user = yield User.findOne({ where: { uuid } });
        yield user.destroy();
        return res.json({ message: "User deleted!" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
}));
app.put("/users/:uuid", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const uuid = req.params.uuid;
    const { name, email, role } = req.body;
    try {
        const user = yield User.findOne({ where: { uuid } });
        user.name = name;
        user.email = email;
        user.role = role;
        yield user.save();
        return res.json(user);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
}));
app.listen({ port: 5000 }, () => __awaiter(this, void 0, void 0, function* () {
    console.log("server is running on http://localhost:5000");
    // await sequelize.sync();
    yield sequelize.authenticate();
    console.log("database Conneted");
}));
