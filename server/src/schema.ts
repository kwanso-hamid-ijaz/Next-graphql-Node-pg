export {};
const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: String!
    name: String!
    email: String!
    role: String!
    posts: [Post!]!
  }
  type Post {
    id: String!
    body: String!
    user: User!
  }
  input SearchUserInput {
    name: String
    role: String
  }
  type Query {
    user: User!
    anyUser(id: String!): User!
    users(limit: Int!, offset: Int!): [User]
    posts(limit: Int!, offset: Int!): [Post]!
    post(id: String!): Post!
    userPosts: [Post]!
    searchUser(input: SearchUserInput): [User]!
    anyUserPosts(id: String!): [Post]!
  }
  type LoginPayload {
    token: String
  }
  type Mutation {
    createUser(
      name: String!
      password: String!
      email: String!
      role: String!
    ): String!
    login(email: String!, password: String!): LoginPayload!
    updateUser(id: String, name: String, email: String, role: String): String!
    deleteUser(id: String): String!
    updatePost(id: String, body: String): String!
    deletePost(id: String): String!
    createPost(body: String!): Post!
  }
`;

module.exports = typeDefs;
