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
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const sequelize_1 = require("sequelize");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { User } = require("./models");
const jwt = require("jsonwebtoken");
const resolvers = {
    Query: {
        user(root, args, { models, user }) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!user) {
                    throw new apollo_server_1.AuthenticationError("Invalid user");
                }
                return models.User.findOne({ where: user.id });
            });
        },
        users(root, args, { models }) {
            return __awaiter(this, void 0, void 0, function* () {
                return models.User.findAll(Object.assign(Object.assign({}, args), { order: [["id", "ASC"]] }));
            });
        },
        userPosts(root, args, { models, user }) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!user) {
                    throw new apollo_server_1.AuthenticationError("Invalid user");
                }
                return models.Post.findAll({
                    where: { userId: user.id },
                });
            });
        },
        anyUserPosts(root, { id }, { models }) {
            return __awaiter(this, void 0, void 0, function* () {
                return models.Post.findAll({
                    where: { userId: id },
                });
            });
        },
        searchUser(root, { input: { name, role } }, { models }) {
            return __awaiter(this, void 0, void 0, function* () {
                const whereClause = {};
                if (name) {
                    Object.assign(whereClause, {
                        name: {
                            [sequelize_1.Op.iLike]: `%${name}%`,
                        },
                    });
                }
                if (role) {
                    Object.assign(whereClause, {
                        role,
                    });
                }
                return models.User.findAll({
                    where: whereClause,
                });
            });
        },
        posts(root, args, { models }) {
            return __awaiter(this, void 0, void 0, function* () {
                return models.Post.findAll(Object.assign(Object.assign({}, args), { order: [["id", "ASC"]] }));
            });
        },
        post(root, { id }, { models }) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield models.Post.findOne({ where: { id } });
            });
        },
        anyUser(root, { id }, { models }) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield models.User.findOne({ where: { id } });
            });
        },
    },
    Mutation: {
        createUser: (root, { id, name, email, password, role }, { models, user: _user }) => __awaiter(void 0, void 0, void 0, function* () {
            const hashed = yield bcrypt.hash(password, 10);
            const user = yield models.User.create({
                id,
                name,
                password: hashed,
                email,
                role,
            });
            return jwt.sign({ id }, "qqqqqqqqqqqqqqqqqqqqqq", {
                expiresIn: "24h",
            });
        }),
        login: (root, { email, password }, { models }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield models.User.findOne({
                where: { email },
            });
            if (!user) {
                throw new Error("No user with that email");
            }
            const valid = yield bcrypt.compare(password, user.password);
            if (!valid) {
                throw new Error("Incorrect password");
            }
            return {
                token: jwt.sign({ id: user.id }, "qqqqqqqqqqqqqqqqqqqqqq", {
                    expiresIn: "24h",
                }),
            };
        }),
        createPost(root, { body }, { models, user }) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!user) {
                    throw new apollo_server_1.AuthenticationError("Invalid");
                }
                return models.Post.create({
                    body,
                    userId: user.id,
                });
            });
        },
        updateUser: (root, { id, name, email, role }, { models, user: _user }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!_user) {
                throw new apollo_server_1.AuthenticationError("Invalid");
            }
            const user = yield models.User.update({
                name,
                email,
                role,
            }, { where: { id } });
            var message;
            if (user)
                message = "User updated successfully";
            else
                message = "Cannot find the User.";
            return message;
        }),
        updatePost: (root, { id, body }, { models }) => __awaiter(void 0, void 0, void 0, function* () {
            const post = yield models.Post.update({
                body,
            }, { where: { id } });
            var message;
            if (post)
                message = "User updated successfully";
            else
                message = "Cannot find the User.";
            return message;
        }),
        deleteUser: (root, { id }, { models, user: _user }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!_user) {
                throw new apollo_server_1.AuthenticationError("Invalid");
            }
            const user = yield models.User.destroy({ where: { id } });
            var message;
            if (user)
                message = "User deleted successfully";
            else
                message = "Cannot find the User.";
            return message;
        }),
        deletePost: (root, { id }, { models }) => __awaiter(void 0, void 0, void 0, function* () {
            const post = yield models.Post.destroy({ where: { id } });
            var message;
            if (post)
                message = "User deleted successfully";
            else
                message = "Cannot find the User.";
            return message;
        }),
    },
    User: {
        posts(user) {
            return __awaiter(this, void 0, void 0, function* () {
                return user.getPosts();
            });
        },
    },
    Post: {
        user(post) {
            return __awaiter(this, void 0, void 0, function* () {
                return post.getUser();
            });
        },
    },
};
module.exports = resolvers;
