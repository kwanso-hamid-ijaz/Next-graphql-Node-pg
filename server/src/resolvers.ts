import { ApolloError, AuthenticationError } from "apollo-server";
import { Op, where } from "sequelize";

require("dotenv").config();
const bcrypt = require("bcrypt");
const { User } = require("./models");
const jwt = require("jsonwebtoken");

const resolvers = {
  Query: {
    async user(root: any, args: any, { models, user }: any) {
      if (!user) {
        throw new AuthenticationError("Invalid user");
      }
      return models.User.findOne({ where: user.id });
    },
    async users(root: any, args: any, { models }: any) {
      return models.User.findAll({ ...args, order: [["id", "ASC"]] });
    },

    async userPosts(root: any, args: any, { models, user }: any) {
      if (!user) {
        throw new AuthenticationError("Invalid user");
      }
      return models.Post.findAll({
        where: { userId: user.id },
      });
    },

    async anyUserPosts(root: any, { id }: any, { models }: any) {
      return models.Post.findAll({
        where: { userId: id },
      });
    },

    async searchUser(
      root: any,
      { input: { name, role } }: any,
      { models }: any
    ) {
      const whereClause = {};
      if (name) {
        Object.assign(whereClause, {
          name: {
            [Op.iLike]: `%${name}%`,
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
    },

    async posts(root: any, args: any, { models }: any) {
      return models.Post.findAll({ ...args, order: [["id", "ASC"]] });
    },

    async post(root: any, { id }: any, { models }: any) {
      return await models.Post.findOne({ where: { id } });
    },

    async anyUser(root: any, { id }: any, { models }: any) {
      return await models.User.findOne({ where: { id } });
    },
  },
  Mutation: {
    createUser: async (
      root: any,
      { id, name, email, password, role }: any,
      { models, user: _user }: any
    ) => {
      const hashed = await bcrypt.hash(password, 10);
      const user = await models.User.create({
        id,
        name,
        password: hashed,
        email,
        role,
      });
      return jwt.sign({ id }, "qqqqqqqqqqqqqqqqqqqqqq", {
        expiresIn: "24h",
      });
    },

    login: async (root: any, { email, password }: any, { models }: any) => {
      const user = await models.User.findOne({
        where: { email },
      });

      if (!user) {
        throw new Error("No user with that email");
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new Error("Incorrect password");
      }

      return {
        token: jwt.sign({ id: user.id }, "qqqqqqqqqqqqqqqqqqqqqq", {
          expiresIn: "24h",
        }),
      };
    },

    async createPost(root: any, { body }: any, { models, user }: any) {
      if (!user) {
        throw new AuthenticationError("Invalid");
      }
      return models.Post.create({
        body,
        userId: user.id,
      });
    },

    updateUser: async (
      root: any,
      { id, name, email, role }: any,
      { models, user: _user }: any
    ) => {
      if (!_user) {
        throw new AuthenticationError("Invalid");
      }
      const user = await models.User.update(
        {
          name,
          email,
          role,
        },
        { where: { id } }
      );
      var message;
      if (user) message = "User updated successfully";
      else message = "Cannot find the User.";
      return message;
    },

    updatePost: async (root: any, { id, body }: any, { models }: any) => {
      const post = await models.Post.update(
        {
          body,
        },
        { where: { id } }
      );
      var message;
      if (post) message = "User updated successfully";
      else message = "Cannot find the User.";
      return message;
    },

    deleteUser: async (
      root: any,
      { id }: any,
      { models, user: _user }: any
    ) => {
      if (!_user) {
        throw new AuthenticationError("Invalid");
      }
      const user = await models.User.destroy({ where: { id } });
      var message;
      if (user) message = "User deleted successfully";
      else message = "Cannot find the User.";
      return message;
    },

    deletePost: async (root: any, { id }: any, { models }: any) => {
      const post = await models.Post.destroy({ where: { id } });
      var message;
      if (post) message = "User deleted successfully";
      else message = "Cannot find the User.";
      return message;
    },
  },

  User: {
    async posts(user) {
      return user.getPosts();
    },
  },
  Post: {
    async user(post) {
      return post.getUser();
    },
  },
};

module.exports = resolvers;
