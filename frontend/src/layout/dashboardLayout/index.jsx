import React, { useEffect, useCallback } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { setTokenIsThere } from "@/config/redux/reducer/authReducer";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";

function Dashboardlayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
    dispatch(setTokenIsThere());
  }, []);

  const navLinks = [
    { path: "/dashboard", label: "Scroll", icon: "🏠" },
    { path: "/discover", label: "Discover", icon: "🔍" },
    { path: "/my-connections", label: "My Connections", icon: "👥" },
  ];

  const isActive = useCallback(
    (path) => router.pathname === path,
    [router.pathname]
  );

  return (
    <div className={styles.dashboardLayout}>
      <div className={styles.homeContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {navLinks.map((link) => (
            <div
              key={link.path}
              onClick={() => router.push(link.path)}
              className={classNames(styles.sideBarOption, {
                [styles.active]: isActive(link.path),
              })}
              title={link.label}
            >
              <span className={styles.sidebarIcon}>{link.icon}</span>
              <p>{link.label}</p>
            </div>
          ))}
        </aside>

        {/* Main Feed */}
        <main className={styles.homeContainer_feedContainer}>{children}</main>

        {/* Top Profiles Section */}
        <aside className={styles.extraContainer}>
          <h3>Top Profiles</h3>
          <div className={styles.profileList}>
            {authState.all_profiles_fetched &&
              authState.all_users
                .filter((profile) => profile.userId)
                .slice(0, 8)
                .map((profile) => (
                  <div
                    key={profile._id}
                    className={styles.profileItem}
                    title={profile.userId.username}
                  >
                    <div className={styles.avatarWrapper}>
                      <img
                        src={
                          profile.userId.profilePicture ||
                          "https://res.cloudinary.com/dvcjojcbu/image/upload/v1752600620/ProConnect/wxmb7ebsqn3eejzavlei.jpg"
                        }
                        alt={`${profile.userId.name}'s avatar`}
                        className={styles.avatar}
                      />
                    </div>
                    <span>{profile.userId.name}</span>
                  </div>
                ))}
          </div>
        </aside>
      </div>

      {/* Mobile Navigation */}
      <nav className={styles.mobileNavBar}>
        {navLinks.map((link) => (
          <div
            key={link.path}
            onClick={() => router.push(link.path)}
            className={classNames(styles.singleNavItemHolder_mobileView, {
              [styles.active]: isActive(link.path),
            })}
            title={link.label}
          >
            <span role="img" aria-label={link.label}>
              {link.icon}
            </span>
          </div>
        ))}
      </nav>
    </div>
  );
}

export default Dashboardlayout;
