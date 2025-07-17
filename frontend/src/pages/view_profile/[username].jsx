import { BASE_URL, clientServer } from "@/config";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Dashboard from "../dashboard";
import UserLayout from "@/layout/userLayout";
import Dashboardlayout from "@/layout/dashboardLayout";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import {
  getConnectionsRequest,
  getMyConnectionRequests,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const postReducer = useSelector((state) => state.postReducer);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const getUsersPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(
      getConnectionsRequest({ token: localStorage.getItem("token") })
    );
    await dispatch(
      getMyConnectionRequests({ token: localStorage.getItem("token") })
    );
  };

  useEffect(() => {
    const post = postReducer.posts.filter(
      (post) => post.userId.username === router.query.username
    );
    setUserPosts(post);
  }, [postReducer.posts]);

  useEffect(() => {
    if (
      authState.connections.some(
        (user) => user.connectionId._id === userProfile.userId._id
      )
    ) {
      setIsCurrentUserInConnection(true);
      const found = authState.connections.find(
        (user) => user.connectionId._id === userProfile.userId._id
      );
      if (found.status_accepted === true) {
        setIsConnectionNull(false);
      }
    }

    if (
      authState.connectionRequest.some(
        (user) => user.userId._id === userProfile.userId._id
      )
    ) {
      setIsCurrentUserInConnection(true);
      const found = authState.connectionRequest.find(
        (user) => user.userId._id === userProfile.userId._id
      );
      if (found.status_accepted === true) {
        setIsConnectionNull(false);
      }
    }
  }, [authState.connections, authState.connectionRequest]);

  useEffect(() => {
    getUsersPost();
  }, []);

  const handleConnect = async () => {
    try {
      await dispatch(
        sendConnectionRequest({
          token: localStorage.getItem("token"),
          user_id: userProfile.userId._id,
        })
      );
      toast.success(" Connection request sent!");
      setIsCurrentUserInConnection(true); // Optional: update UI
    } catch (error) {
      toast.error(" Failed to send connection request.");
    }
  };

  return (
    <UserLayout>
      <Dashboardlayout>
        <ToastContainer position="top-center" autoClose={3000} />
        <div className={styles.container}>
          {/* Profile Header */}
          <div className={styles.profileHeader}>
            <img
              className={styles.profilePicture}
              src={userProfile.userId.profilePicture}
              alt={`${userProfile.userId.name} profile`}
            />
            <div className={styles.profileInfo}>
              <h2>{userProfile.userId.name}</h2>
              <p className={styles.username}>@{userProfile.userId.username}</p>
              <p className={styles.bio}>{userProfile.bio}</p>

              <div className={styles.actions}>
                {isCurrentUserInConnection ? (
                  <button className={styles.connectedButton}>
                    {isConnectionNull ? "Pending" : "Connected"}
                  </button>
                ) : (
                  <button onClick={handleConnect} className={styles.connectBtn}>
                    Connect
                  </button>
                )}

                <button
                  className={styles.resumeBtn}
                  onClick={async () => {
                    const response = await clientServer.get(
                      `/user/download_resume?id=${userProfile.userId._id}`
                    );
                    window.open(
                      `${BASE_URL}/${response.data.message}`,
                      "_blank"
                    );
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 16.5l4.5-4.5h-3V3h-3v9H7.5L12 16.5zm6 2.25H6V18h12v.75z" />
                  </svg>
                  Resume
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <section className={styles.section}>
            <h3>Recent Activity</h3>
            {userPosts.length > 0 ? (
              (() => {
                const sortedPosts = [...userPosts].sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                const latestPost = sortedPosts[0];
                return (
                  <div className={styles.recentPost}>
                    {latestPost.media && (
                      <img src={latestPost.media} alt="Recent Post" />
                    )}
                    <p>{latestPost.body}</p>
                  </div>
                );
              })()
            ) : (
              <p>No recent activity</p>
            )}
          </section>

          {/* Current Post */}
          <section className={styles.section}>
            <h3>Current Position</h3>
            <div className={styles.readOnlyInput}>
              <span>{userProfile.currentPost}</span>
            </div>
          </section>

          {/* Work History */}
          <section className={styles.section}>
            <h3>Work History</h3>
            <div className={styles.cardList}>
              {userProfile.pastWork.map((work, idx) => (
                <div className={styles.card} key={idx}>
                  <p>
                    <strong>{work.company}</strong>
                  </p>
                  <p>
                    <strong>Position:</strong> {work.position}
                  </p>
                  <p>
                    <strong>Years:</strong> {work.years}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className={styles.section}>
            <h3>Education</h3>
            <div className={styles.cardList}>
              {userProfile.education.map((edu, idx) => (
                <div className={styles.card} key={idx}>
                  <p>
                    <strong>{edu.school}</strong>
                  </p>
                  <p>
                    <strong>Degree:</strong> {edu.degree}
                  </p>
                  <p>
                    <strong>Field of Study:</strong> {edu.fieldOfStudy}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </Dashboardlayout>
    </UserLayout>
  );
}

export default ViewProfilePage;

export async function getServerSideProps(context) {
  console.log(context.query.username);
  const request = await clientServer.get(
    "/user/get_profile_based_on_username",
    {
      params: {
        username: context.query.username,
      },
    }
  );

  const response = await request.data;
  console.log(response);
  return { props: { userProfile: response.profile } };
}
