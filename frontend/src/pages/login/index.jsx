import UserLayout from "@/layout/userLayout";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [userLoginMethod, setUserLoginMethod] = useState(false); // false = Sign Up
  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const emailRef = useRef(null);

  useEffect(() => {
    if (userLoginMethod && emailRef.current) {
      emailRef.current.focus();
    }
  }, [userLoginMethod]);

  useEffect(() => {
    if (authState.loggedIn) {
      toast.success("Logged in successfully ");
      router.replace("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.replace("/dashboard");
    }
  }, []);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod]);

  useEffect(() => {
    if (authState.message?.message) {
      if (authState.isError) {
        toast.error(`❌ ${authState.message.message}`);
      } else {
        toast.success(`✅ ${authState.message.message}`);

        // Auto switch to login after successful registration
        if (!userLoginMethod) {
          setUserLoginMethod(true);
          setUsername("");
          setName("");
          setEmailAddress("");
          setPassword("");
          setPasswordStrength("");

          setTimeout(() => {
            if (emailRef.current) emailRef.current.focus();
          }, 100);
        }
      }
    }
  }, [authState.message]);

  const validatePasswordStrength = (pwd) => {
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    const hasOnlyValid = /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]*$/.test(pwd); // includes numbers now

    if (!pwd) return setPasswordStrength("");

    if (hasUppercase && hasSpecial && hasOnlyValid) {
      setPasswordStrength("strong");
    } else {
      setPasswordStrength("weak");
    }
  };

  const handleRegister = () => {
    if (!username || !email || !password || !name) {
      toast.info("⚠️ Please fill all registration fields.");
      return;
    }

    if (passwordStrength !== "strong") {
      toast.error("❌ Password must have 1 uppercase and 1 special character.");
      return;
    }

    dispatch(registerUser({ username, password, email, name }));
  };

  const handleLogin = () => {
    if (!email || !password) {
      toast.info("⚠️ Please enter email and password.");
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  return (
    <UserLayout>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        transition={Slide}
      />

      <div className={styles.container}>
        <div className={`${styles.cardContainer} ${styles.fadeIn}`}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardleft_heading}>
              {userLoginMethod ? "Sign In" : "Sign Up"}
            </p>

            <div className={styles.inputContainer}>
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    className={styles.inputField}
                    type="text"
                    placeholder="Username"
                  />
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className={styles.inputField}
                    type="text"
                    placeholder="Name"
                  />
                </div>
              )}

              <input
                ref={emailRef}
                onChange={(e) => setEmailAddress(e.target.value)}
                value={email}
                className={styles.inputField}
                type="email"
                placeholder="Email"
              />

              <div className={styles.passwordWrapper}>
                <input
                  onChange={(e) => {
                    const newPwd = e.target.value;
                    setPassword(newPwd);

                    if (!userLoginMethod) {
                      validatePasswordStrength(newPwd);
                    } else {
                      setPasswordStrength(""); // ✅ Reset when in Sign In mode
                    }
                  }}
                  value={password}
                  className={styles.inputField}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={styles.svgIcon}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    // Eye-slash SVG
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      width="20"
                      viewBox="0 0 640 512"
                      fill="currentColor"
                    >
                      <path d="M634 471L45 7C39-2 27-2 21 7s-6 24 3 30l60 47C33 134 0 192 0 192s96 176 320 176c52 0 97-8 136-22l51 40c10 8 24 5 32-5s5-24-5-32zm-88-67l-37-29c8-15 15-32 21-51 4-14 7-29 9-43-13-1-26-2-39-2-13 0-25 0-37 1-11 0-22 1-33 3l-48-38C408 241 416 258 416 272c0 39-33 72-72 72-14 0-27-4-38-10l-41-33c-3-9-6-18-7-28l-52-41c-15 4-29 10-43 17l-29-23c12-4 25-8 38-12 16-4 33-6 50-6 20 0 39 2 57 5 22 4 42 10 60 17 21 8 40 17 58 27 19 10 35 22 50 34 9 7 18 14 25 22z" />
                    </svg>
                  ) : (
                    // Eye SVG
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      width="20"
                      viewBox="0 0 576 512"
                      fill="currentColor"
                    >
                      <path d="M572.5 241.4C518.6 135.6 407.3 64 288 64 168.7 64 57.4 135.6 3.5 241.4c-4.7 9.3-4.7 20.5 0 29.7C57.4 376.4 168.7 448 288 448c119.3 0 230.6-71.6 284.5-176.9 4.7-9.3 4.7-20.5 0-29.7zM288 400c-97.2 0-192-57.2-240-144 48-86.8 142.8-144 240-144s192 57.2 240 144c-48 86.8-142.8 144-240 144zm0-272c-70.6 0-128 57.4-128 128s57.4 128 128 128 128-57.4 128-128-57.4-128-128-128zm0 192c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64z" />
                    </svg>
                  )}
                </span>
              </div>

              {/* Password Strength Progress Bar */}
              {!userLoginMethod && password && (
                <div className={styles.strengthBarWrapper}>
                  <div
                    className={`${styles.strengthBar} ${
                      passwordStrength === "strong"
                        ? styles.strong
                        : styles.weak
                    }`}
                  >
                    {passwordStrength === "strong"
                      ? "Strong Password"
                      : "Weak Password"}
                  </div>
                </div>
              )}

              <div
                onClick={() => {
                  userLoginMethod ? handleLogin() : handleRegister();
                }}
                className={styles.buttonWithOutline}
              >
                <p>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
              </div>
            </div>
          </div>

          <div className={styles.cardContainer_right}>
            {userLoginMethod ? (
              <p>Don't Have an Account?</p>
            ) : (
              <p>Already Have an Account?</p>
            )}

            <div
              onClick={() => {
                const switchingToLogin = !userLoginMethod;
                setUserLoginMethod(switchingToLogin);

                // Delay clearing fields until after form switch renders
                setTimeout(() => {
                  setUsername("");
                  setName("");
                  setEmailAddress("");
                  setPassword("");
                  setPasswordStrength("");

                  if (switchingToLogin && emailRef.current) {
                    emailRef.current.focus();
                  }
                }, 50);
              }}
              style={{ color: "black", textAlign: "center" }}
              className={styles.buttonWithOutline}
            >
              <p>{userLoginMethod ? "Sign Up" : "Sign In"}</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
