import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";

export default function NavbarComponent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(reset());
    router.push("/login");
  };

  return (
    <header className={styles.container}>
      <nav className={styles.navBar}>
        <div className={styles.logo} onClick={() => router.push("/")}>
          <span className={styles.logoMain}>Pro</span>
          <span className={styles.logoAccent}>Connect</span>
        </div>

        <div className={styles.navBarOptionContainer}>
          {authState.profileFetched ? (
            <>
              <button
                className={styles.navButton}
                onClick={() => router.push("/profile")}
              >
                Profile
              </button>
              <button className={styles.logoutButton} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button
              className={styles.joinButton}
              onClick={() => router.push("/login")}
            >
              Be a Part
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
