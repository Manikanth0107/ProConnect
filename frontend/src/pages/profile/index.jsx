import { getAboutUser } from "@/config/redux/action/authAction";
import Dashboardlayout from "@/layout/dashboardLayout";
import UserLayout from "@/layout/userLayout";
import styles from "./index.module.css";
import { BASE_URL, clientServer } from "@/config";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";

function ProfilePage() {
  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.postReducer);

  const dispatch = useDispatch();

  const router = useRouter();

  const [userProfile, setUserProfile] = useState({});

  const [userPosts, setUserPosts] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isAddEducationOpen, setIsAddEducationOpen] = useState(false);

  const [inputData, setInputData] = useState({
    company: "",
    position: "",
    years: "",
  });

  const [educationData, setEducationData] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
  });

  const handleEducationInputChange = (e) => {
    const { name, value } = e.target;
    setEducationData({ ...educationData, [name]: value });
  };

  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
  }, []);

  useEffect(() => {
    if (authState.user != undefined) {
      setUserProfile(authState.user);
      let post = postReducer.posts.filter((post) => {
        return post.userId.username === authState.user.userId.username;
      });
      setUserPosts(post);
    }
  }, [authState.user, postReducer.posts]);

  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    const response = await clientServer.post(
      "/update_profile_picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const updateProfileData = async () => {
    const request = await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });

    const response = await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education,
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  return (
    <UserLayout>
      <Dashboardlayout>
        {authState.user && userProfile.userId && (
          <div className={styles.container}>
            <div className={styles.backDropContainer}>
              <div className={styles.backDrop}>
                <label
                  htmlFor="ProfilePictureUpload"
                  className={styles.backDrop_overlay}
                >
                  <p>Edit</p>
                </label>
                <input
                  onChange={(e) => {
                    updateProfilePicture(e.target.files[0]);
                  }}
                  hidden
                  type="file"
                  id="ProfilePictureUpload"
                />
                <img src={`${BASE_URL}/${userProfile.userId.profilePicture}`} />
              </div>
            </div>
            <div className={styles.profileContainer_details}>
              <div className={styles.profileContainer__flex}>
                <div style={{ flex: "0.8" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "fit-content",
                      alignItems: "center",
                      gap: "0.7rem",
                    }}
                  >
                    <input
                      className={styles.nameEdit}
                      type="text"
                      value={userProfile.userId.name}
                      onChange={(e) => {
                        setUserProfile({
                          ...userProfile,
                          userId: {
                            ...userProfile.userId,
                            name: e.target.value,
                          },
                        });
                      }}
                    />
                    <p style={{ color: "grey" }}>
                      @{userProfile.userId.username}
                    </p>
                  </div>

                  <div>
                    <textarea
                      value={userProfile.bio}
                      onChange={(e) => {
                        setUserProfile({ ...userProfile, bio: e.target.value });
                      }}
                      rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
                <div style={{ flex: "0.2" }}>
                  <h3>Recent Activity</h3>
                  {userPosts.length > 0 ? (
                    (() => {
                      // Sort posts by createdAt (assuming posts have a createdAt timestamp)
                      const sortedPosts = [...userPosts].sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      );

                      // Get the most recent post
                      const latestPost = sortedPosts[0];

                      return (
                        <div key={latestPost._id} className={styles.postCard}>
                          <div className={styles.card}>
                            <div className={styles.card_profileContainer}>
                              {latestPost.media ? (
                                <img
                                  src={`${BASE_URL}/${latestPost.media}`}
                                  alt="Recent Post"
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "3.4rem",
                                    height: "3.4rem",
                                    background: "#f0f0f0",
                                  }}
                                ></div>
                              )}
                            </div>
                            <p>{latestPost.body}</p>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <p>No recent activity</p>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.current_post}>
              <h4>Current Post</h4>
              <input
                className={styles.currentPostEdit}
                type="text"
                value={userProfile.currentPost}
                onChange={(e) => {
                  setUserProfile({
                    ...userProfile,
                    currentPost: e.target.value,
                  });
                }}
              />
            </div>

            <div className="workHistory">
              <h4>Work History</h4>
              <div className={styles.workHistoryContainer}>
                {userProfile.pastWork.map((work, index) => {
                  return (
                    <div key={index} className={styles.workHistoryCard}>
                      <p
                        style={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        {work.company} - {work.position}
                      </p>
                      <p>{work.years}</p>
                    </div>
                  );
                })}

                <button
                  className={styles.addWorkButton}
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  Add Work
                </button>
              </div>
            </div>

            <div className="education">
              <h4>Education</h4>
              <div className={styles.addEducationContainer}>
                {userProfile.education.map((education, index) => {
                  return (
                    <div key={index} className={styles.workHistoryCard}>
                      <p
                        style={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        School: {education.school}
                      </p>
                      <p
                        style={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        Degree: {education.degree}
                      </p>
                      <p>{education.fieldOfStudy}</p>
                    </div>
                  );
                })}

                <button
                  className={styles.addEducationButton}
                  onClick={() => {
                    setIsAddEducationOpen(true);
                  }}
                >
                  Add Education
                </button>
              </div>
            </div>

            {userProfile != authState.user && (
              <div
                onClick={() => {
                  updateProfileData();
                }}
                className={styles.updateProfileBtn}
              >
                Update Profile
              </div>
            )}
          </div>
        )}

        {isModalOpen && (
          <div
            onClick={() => {
              setIsModalOpen(false);
            }}
            className={styles.commentsContainer}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={styles.allCommentsContainer}
            >
              <input
                onChange={handleWorkInputChange}
                name="company"
                className={styles.inputField}
                type="text"
                placeholder="Enter Company"
              />
              <input
                onChange={handleWorkInputChange}
                name="position"
                className={styles.inputField}
                type="text"
                placeholder="Enter Position"
              />
              <input
                onChange={handleWorkInputChange}
                name="years"
                className={styles.inputField}
                type="number"
                placeholder="Years"
              />

              <div
                onClick={() => {
                  setUserProfile({
                    ...userProfile,
                    pastWork: [...userProfile.pastWork, inputData],
                  });
                  setIsModalOpen(false);
                }}
                className={styles.updateProfileBtn}
              >
                Add Work
              </div>
            </div>
          </div>
        )}

        {isAddEducationOpen && (
          <div
            onClick={() => {
              setIsAddEducationOpen(false);
            }}
            className={styles.commentsContainer}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={styles.allCommentsContainer}
            >
              <input
                onChange={handleEducationInputChange}
                name="school"
                className={styles.inputField}
                type="text"
                placeholder="Enter School"
              />
              <input
                onChange={handleEducationInputChange}
                name="degree"
                className={styles.inputField}
                type="text"
                placeholder="Enter Degree"
              />
              <input
                onChange={handleEducationInputChange}
                name="fieldOfStudy"
                className={styles.inputField}
                type="text"
                placeholder="Enter Field Of Study like 2015-2019"
              />

              <div
                onClick={() => {
                  setUserProfile({
                    ...userProfile,
                    education: [...userProfile.education, educationData],
                  });
                  setIsAddEducationOpen(false);
                }}
                className={styles.updateProfileBtn}
              >
                Add Education
              </div>
            </div>
          </div>
        )}
      </Dashboardlayout>
    </UserLayout>
  );
}

export default ProfilePage;
