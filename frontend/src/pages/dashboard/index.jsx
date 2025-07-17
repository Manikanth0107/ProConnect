import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import {
  createPost,
  deletePost,
  getAllComments,
  getAllPosts,
  incrementPostLike,
  postComment,
} from "@/config/redux/action/postAction";
import Dashboardlayout from "@/layout/dashboardLayout";
import UserLayout from "@/layout/userLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { resetPostId } from "@/config/redux/reducer/postReducer";

// ✅ Toastify Integration
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.postReducer);

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState(null);
  const [commentText, setCommentText] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (authState.isTokenThere) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.isTokenThere]);

  const handleUpload = async () => {
    if (postContent.trim() === "" && !fileContent) return;

    try {
      await dispatch(createPost({ file: fileContent, body: postContent }));
      toast.success("Post uploaded successfully!");
    } catch (err) {
      toast.error("Failed to upload post.");
    }

    setPostContent("");
    setFileContent(null);
    dispatch(getAllPosts());
  };

  if (!authState.user) {
    return (
      <UserLayout>
        <Dashboardlayout>
          <h2>Loading....</h2>
        </Dashboardlayout>
      </UserLayout>
    );
  }

  const currentUserId = authState.user.userId._id;

  return (
    <UserLayout>
      <Dashboardlayout>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />

        <div className={styles.scrollComponent}>
          <div className={styles.wrapper}>
            {/* Create Post */}
            <div className={styles.createPostContainer}>
              <img
                className={styles.userProfile}
                src={authState.user.userId.profilePicture}
                alt="User"
              />
              <div className={styles.inputArea}>
                <textarea
                  className={styles.textAreaOfContent}
                  placeholder="What's in your mind?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                ></textarea>

                <div className={styles.actionRow}>
                  <label htmlFor="fileUpload">
                    <div className={styles.Fab} title="Attach image">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        width="20"
                        height="20"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </div>
                  </label>
                  <input
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const maxSize = 5 * 1024 * 1024; // 5MB
                        if (file.size > maxSize) {
                          toast.error("File size exceeds 5MB limit.");
                          e.target.value = "";
                          setFileContent(null);
                        } else {
                          setFileContent(file);
                          toast.success("File accepted ✅");
                        }
                      }
                    }}
                    type="file"
                    hidden
                    id="fileUpload"
                  />

                  {postContent.trim() || fileContent ? (
                    <div onClick={handleUpload} className={styles.uploadButton}>
                      Post
                    </div>
                  ) : (
                    <div
                      className={`${styles.uploadButton} ${styles.disabled}`}
                    >
                      Post
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Posts Section */}
            <div className={styles.postsContainer}>
              {postState.posts.map((post) => {
                const alreadyLiked = post.likedBy?.some(
                  (user) => user._id === currentUserId
                );

                return (
                  <div key={post._id} className={styles.singleCard}>
                    <div className={styles.singleCard_profileContainer}>
                      <img
                        className={styles.userProfile}
                        src={post.userId.profilePicture}
                        alt={`${post.userId.name} profile`}
                      />
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <p style={{ fontWeight: "bold" }}>
                            {post.userId.name}
                          </p>
                          {post.userId._id === currentUserId && (
                            <div
                              onClick={() =>
                                dispatch(deletePost({ post_id: post._id }))
                                  .then(() => {
                                    toast.success("Post deleted");
                                    dispatch(getAllPosts());
                                  })
                                  .catch(() => {
                                    toast.error("Failed to delete post");
                                  })
                              }
                              title="Delete Post"
                              style={{ cursor: "pointer" }}
                            >
                              🗑️
                            </div>
                          )}
                        </div>
                        <p className={styles.username}>
                          @{post.userId.username}
                        </p>
                        <p className={styles.postText}>{post.body}</p>

                        {post.media && (
                          <div className={styles.singleCard_image}>
                            <img src={post.media} alt="Post Media" />
                          </div>
                        )}

                        {/* Actions */}
                        <div className={styles.optionsContainer}>
                          <div
                            className={styles.singleOption_optionsContainer}
                            onClick={() => {
                              if (!alreadyLiked) {
                                dispatch(
                                  incrementPostLike({
                                    post_id: post._id,
                                    token: localStorage.getItem("token"),
                                  })
                                )
                                  .then(() => dispatch(getAllPosts()))
                                  .catch(() =>
                                    toast.error("Failed to like post")
                                  );
                              }
                            }}
                            title={alreadyLiked ? "Liked" : "Like"}
                            style={{
                              cursor: alreadyLiked ? "default" : "pointer",
                              color: alreadyLiked ? "#007aff" : "#555",
                            }}
                          >
                            <span className={styles.icon}>👍</span>
                            <span>
                              {alreadyLiked ? "Liked" : "Like"}
                              {post.likes > 0 && ` (${post.likes})`}
                            </span>
                          </div>

                          <div
                            className={styles.singleOption_optionsContainer}
                            onClick={() =>
                              dispatch(getAllComments({ post_id: post._id }))
                            }
                            title="Comment"
                          >
                            <span className={styles.icon}>💬</span>
                            <span>Comment</span>
                          </div>

                          <div
                            className={styles.singleOption_optionsContainer}
                            onClick={() => {
                              const text = encodeURIComponent(post.body);
                              const url = encodeURIComponent("apnacollege.in");
                              const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                              window.open(twitterUrl, "_blank");
                            }}
                            title="Share"
                          >
                            <span className={styles.icon}>🔗</span>
                            <span>Share</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Comments Modal */}
        {postState.postId && (
          <div
            onClick={() => dispatch(resetPostId())}
            className={styles.commentsContainer}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={styles.allCommentsContainer}
            >
              {postState.comments.length === 0 ? (
                <h2>No Comments</h2>
              ) : (
                postState.comments.map((comment) => (
                  <div className={styles.singleComment} key={comment._id}>
                    <div className={styles.singleComment_profileContainer}>
                    
                      <div>
                        <p
                          style={{
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                          }}
                        >
                          {comment.userId.name}
                        </p>
                        <p>@{comment.userId.username}</p>
                      </div>
                    </div>
                    <p>{comment.body}</p>
                  </div>
                ))
              )}

              <div className={styles.postCommentContainer}>
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                />
                <div
                  onClick={async () => {
                    if (commentText.trim() === "") return;
                    try {
                      await dispatch(
                        postComment({
                          post_id: postState.postId,
                          body: commentText,
                        })
                      );
                      await dispatch(
                        getAllComments({ post_id: postState.postId })
                      );
                      setCommentText("");
                      toast.success("Comment added");
                    } catch (err) {
                      toast.error("Failed to add comment");
                    }
                  }}
                  className={styles.postCommentContainer_commentBtn}
                >
                  <p>Comment</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Dashboardlayout>
    </UserLayout>
  );
}

export default Dashboard;
