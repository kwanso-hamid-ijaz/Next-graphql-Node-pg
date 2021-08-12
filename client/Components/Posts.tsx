import postsStyles from "../styles/Posts.module.css";

export default function Posts({ posts }: any) {
  return (
    <div>
      {/* {!posts.length && <h1>No more posts to show</h1>} */}
      <h1 className={postsStyles.heading}>All Posts</h1>

      {posts?.map((post: any) => (
        <article className={postsStyles.art} key={post.id}>
          <div className={postsStyles.body}>{post.body}</div>
          <div className={postsStyles.aurther}>written by {post.user.name}</div>
        </article>
      ))}
    </div>
  );
}
