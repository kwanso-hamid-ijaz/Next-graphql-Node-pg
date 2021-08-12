import Head from "next/head";
import Image from "next/image";

import { gql } from "@apollo/client";
import client from "../client";
import postsStyles from "../styles/Posts.module.css";
import { useState } from "react";
import { Button } from "@material-ui/core";
import Posts from "../Components/Posts";
import Nav from "../Components/Nav";
import Users from "../Components/Users";

import { useRouter } from "next/router";

// In your component body

export const LOAD_USERS = gql`
  query users($limit: Int!, $offset: Int!) {
    users(limit: $limit, offset: $offset) {
      id
      name
      email
      role
    }
  }
`;

interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function GetUsers({ users: usersData }: any) {
  const router = useRouter();
  const [offset, setoffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [users, setUsers] = useState<UserType[]>(usersData);

  const loadmore = async (limit: any, offset: any) => {
    const { data } = await client.query({
      query: LOAD_USERS,
      variables: { limit: limit, offset: offset },
    });

    setUsers(data.users);
  };
  return (
    <div>
      {offset != 0 && (
        <Button
          color="primary"
          style={{
            float: "left",
            left: "5%",
          }}
          onClick={() => {
            setoffset(offset - limit);
            loadmore(limit, offset - limit);
          }}
        >
          &#171; Previous
        </Button>
      )}
      {users.length == limit && (
        <Button
          color="primary"
          style={{
            float: "right",
            right: "5%",
          }}
          onClick={() => {
            setoffset(limit + offset);
            loadmore(limit, offset + limit);
          }}
        >
          Next &#187;
        </Button>
      )}
      <span
        className="pg"
        style={{
          color: "red",
          fontSize: "100%",
          position: "absolute",
          right: "17%",
          top: "17%",
        }}
      >
        Page Number: {offset == 0 ? 1 : offset / limit + 1}
      </span>

      {!users.length && <h1>No more posts to show</h1>}
      <Users users={users} />
    </div>
  );
}

export async function getServerSideProps() {
  const { data } = await client.query({
    query: LOAD_USERS,
    variables: { limit: 10, offset: 0 },
  });

  return {
    props: {
      users: data.users,
    },
  };
}
