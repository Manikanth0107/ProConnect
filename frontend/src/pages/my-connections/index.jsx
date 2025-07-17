import { BASE_URL } from "@/config";
import {
  AcceptConnection,
  getMyConnectionRequests,
} from "@/config/redux/action/authAction";
import Dashboardlayout from "@/layout/dashboardLayout";
import UserLayout from "@/layout/userLayout";
import React, { useEffect } from "react";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

function MyConnectionsPage() {
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
  }, []);

  const router = useRouter();

  useEffect(() => {
    if (authState.connectionRequest.length != 0) {
      console.log(authState.connectionRequest);
    }
  }, [authState.connectionRequest]);

  return (
    <UserLayout>
      <Dashboardlayout>
        <div className={styles.container}>
          <h2>My Connections</h2>

          <section className={styles.section}>
            <h3>Pending Requests</h3>
            {authState.connectionRequest.filter(
              (conn) => conn.status_accepted === null
            ).length === 0 ? (
              <p className={styles.empty}>No connection requests pending.</p>
            ) : (
              <div className={styles.grid}>
                {authState.connectionRequest
                  .filter((conn) => conn.status_accepted === null)
                  .map((user, index) => (
                    <div
                      key={index}
                      className={styles.userCard}
                      onClick={() =>
                        router.push(`/view_profile/${user.userId.username}`)
                      }
                    >
                      <img
                        className={styles.avatar}
                        src={user.userId.profilePicture}
                        alt={user.userId.name}
                      />
                      <div className={styles.info}>
                        <h4>{user.userId.name}</h4>
                        <p>@{user.userId.username}</p>
                      </div>
                      <button
                        className={styles.acceptBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            AcceptConnection({
                              connectionId: user._id,
                              token: localStorage.getItem("token"),
                              action: "accept",
                            })
                          );
                        }}
                      >
                        Accept
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </section>

          <section className={styles.section}>
            <h3>My Network</h3>
            {authState.connectionRequest.filter(
              (conn) => conn.status_accepted !== null
            ).length === 0 ? (
              <p className={styles.empty}>No active connections yet.</p>
            ) : (
              <div className={styles.grid}>
                {authState.connectionRequest
                  .filter((conn) => conn.status_accepted !== null)
                  .map((user, index) => (
                    <div
                      key={index}
                      className={styles.userCard}
                      onClick={() =>
                        router.push(`/view_profile/${user.userId.username}`)
                      }
                    >
                      <img
                        className={styles.avatar}
                        src={user.userId.profilePicture}
                        alt={user.userId.name}
                      />
                      <div className={styles.info}>
                        <h4>{user.userId.name}</h4>
                        <p>@{user.userId.username}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        </div>
      </Dashboardlayout>
    </UserLayout>
  );
}

export default MyConnectionsPage;
