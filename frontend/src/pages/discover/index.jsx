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
          <h1>Discover</h1>

          <div className={styles.allUserProfile}>
            {authState.all_profiles_fetched &&
              authState.all_users.map((user) => {
                return (
                  <div
                    onClick={() => {
                      if (
                        user.userId.username ===
                        authState.user?.userId?.username
                      ) {
                        // If the clicked user is the logged-in user, redirect to their profile
                        router.push("/profile");
                      } else {
                        // Otherwise, redirect to their profile view page
                        router.push(`/view_profile/${user.userId.username}`);
                      }
                    }}
                    key={user._id}
                    className={styles.userCard}
                  >
                    <img
                      className={styles.userCardImage}
                      src={`${BASE_URL}/${user.userId.profilePicture}`}
                      alt="Profile Picture"
                    />
                    <div>
                      <h1>{user.userId.name}</h1>
                      <p>{user.userId.username}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </Dashboardlayout>
      </UserLayout>
    </div>
  );
}

export default DiscoverPage;
