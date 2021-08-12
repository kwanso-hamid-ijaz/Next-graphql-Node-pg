import { AuthenticationError } from "apollo-server";

const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const models = require("./models");
const jwt = require("jsonwebtoken");

// const getUser = (token: any) => {
//   if (token) {
//     try {
//       // return the user information from the token
//       return jwt.verify(token, "qqqqqqqqqqqqqqqqqqqqqq");
//     } catch (err) {
//       // if there's a problem with the token, throw an error
//       throw new AuthenticationError("In valid Token | session expired");
//     }
//   }
// };

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { models },
  // context: ({ req }) => {
  //   const token = req.headers?.authorization;
  //   let user: any = null;
  //   if (token) {
  //     user = getUser(token);
  //   }
  //   return { models, user };
  // },
});

server.listen().then(({}) => {
  console.log("Server is running on http://localhost:4000");
});
