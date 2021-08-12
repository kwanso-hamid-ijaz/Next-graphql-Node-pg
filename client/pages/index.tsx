import Head from "next/head";
import Image from "next/image";

import { gql } from "@apollo/client";
import client from "../client";
import postsStyles from "../styles/Posts.module.css";
import { useState } from "react";
import { Button } from "@material-ui/core";
import Posts from "../Components/Posts";
import Nav from "../Components/Nav";

export const LOAD_POSTS = gql`
  query posts($limit: Int!, $offset: Int!) {
    posts(limit: $limit, offset: $offset) {
      id
      body
      user {
        id
        name
      }
    }
  }
`;

interface UserType {
  id: string;
  name: string;
}

interface PostType {
  id: string;
  body: string;
  user: UserType;
}

export default function Home({ posts: postsData }: any) {
  const [offset, setoffset] = useState(0);
  const [limit, setLimit] = useState(7);
  const [posts, setPosts] = useState<PostType[]>(postsData);

  const loadmore = async (limit: any, offset: any) => {
    const { data } = await client.query({
      query: LOAD_POSTS,
      variables: { limit: limit, offset: offset },
    });
    setPosts(data.posts);
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
      {posts.length == limit && (
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

      {!posts.length && <h1>No more posts to show</h1>}
      <Posts posts={posts} />
    </div>
  );
}
// getStaticProps
export async function getServerSideProps() {
  const { data } = await client.query({
    query: LOAD_POSTS,
    variables: { limit: 7, offset: 0 },
  });

  return {
    props: {
      posts: data.posts,
    },
  };
}
