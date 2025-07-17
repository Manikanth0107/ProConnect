import { BASE_URL } from "@/config";
import { getAllUsers } from "@/config/redux/action/authAction";
import Dashboardlayout from "@/layout/dashboardLayout";
import UserLayout from "@/layout/userLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { useRouter } from "next/router";

function DiscoverPage() {
  const authState = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, []);

  const router = useRouter();
  return (
    <div>
      <UserLayout>
        <Dashboardlayout>
          <h1 className={styles.pageTitle}>Discover Professionals</h1>

          <div className={styles.userGrid}>
            {authState.all_profiles_fetched &&
              authState.all_users.map((user) => (
                <div
                  key={user._id}
                  className={styles.userCard}
                  onClick={() => {
                    const isOwnProfile =
                      user.userId.username === authState.user?.userId?.username;
                    router.push(
                      isOwnProfile
                        ? "/profile"
                        : `/view_profile/${user.userId.username}`
                    );
                  }}
                >
                  <div className={styles.avatarWrapper}>
                    <img
                      className={styles.avatar}
                      src={user.userId.profilePicture}
                      alt={`${user.userId.name} profile`}
                    />
                  </div>
                  <div className={styles.userInfo}>
                    <h2>{user.userId.name}</h2>
                    <p>@{user.userId.username}</p>
                  </div>
                </div>
              ))}
          </div>
        </Dashboardlayout>
      </UserLayout>
    </div>
  );
}

export default DiscoverPage;
