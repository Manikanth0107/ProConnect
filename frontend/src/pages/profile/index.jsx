import { getAboutUser } from "@/config/redux/action/authAction";
import Dashboardlayout from "@/layout/dashboardLayout";
import UserLayout from "@/layout/userLayout";
import styles from "./index.module.css";
import { BASE_URL, clientServer } from "@/config";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProfilePage() {
  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.postReducer);

  const dispatch = useDispatch();
  const router = useRouter();

  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddEducationOpen, setIsAddEducationOpen] = useState(false);

  const [editWorkIndex, setEditWorkIndex] = useState(null); // null for add, index for edit
  const [editWorkData, setEditWorkData] = useState({
    company: "",
    position: "",
    years: "",
  });

  const [editEduIndex, setEditEduIndex] = useState(null);
  const [editEduData, setEditEduData] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
  });

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
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    try {
      const response = await clientServer.post(
        "/update_profile_picture",
        formData
      );
      if (response.status === 200) {
        toast.success("Profile picture updated successfully!");
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
      }
    } catch (err) {
      toast.error("Something went wrong while updating the profile picture.");
    }
  };

  const updateProfileData = async () => {
    try {
      await clientServer.post("/user_update", {
        token: localStorage.getItem("token"),
        name: userProfile.userId.name,
      });

      await clientServer.post("/update_profile_data", {
        token: localStorage.getItem("token"),
        bio: userProfile.bio,
        currentPost: userProfile.currentPost,
        pastWork: userProfile.pastWork,
        education: userProfile.education,
      });

      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <UserLayout>
      <Dashboardlayout>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
        />
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
                    if (e.target.files && e.target.files.length > 0) {
                      updateProfilePicture(e.target.files[0]);
                    }
                  }}
                  hidden
                  type="file"
                  id="ProfilePictureUpload"
                  accept="image/*"
                />
                <img src={userProfile.userId.profilePicture} alt="Profile" />
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
                    <label className={styles.inputLabel}>Bio</label>
                    <textarea
                      className={styles.bioTextarea}
                      value={userProfile.bio}
                      onChange={(e) => {
                        setUserProfile({ ...userProfile, bio: e.target.value });
                      }}
                    />
                  </div>
                </div>

                <div style={{ flex: "0.2" }}>
                  <h3>Recent Activity</h3>
                  {userPosts.length > 0 ? (
                    (() => {
                      const sortedPosts = [...userPosts].sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      );
                      const latestPost = sortedPosts[0];

                      return (
                        <div key={latestPost._id} className={styles.postCard}>
                          <div className={styles.card}>
                            <div className={styles.card_profileContainer}>
                              {latestPost.media ? (
                                <img src={latestPost.media} alt="Recent Post" />
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
                {userProfile.pastWork.map((work, index) => (
                  <div key={index} className={styles.workHistoryCard}>
                    <p>
                      <strong>{work.company}</strong>
                    </p>
                    <p>Position: {work.position}</p>
                    <p>Years: {work.years}</p>
                    <button
                      className={styles.editButton}
                      onClick={() => {
                        setEditWorkIndex(index);
                        setEditWorkData(work);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => {
                        const updatedWork = userProfile.pastWork.filter(
                          (_, i) => i !== index
                        );
                        setUserProfile({
                          ...userProfile,
                          pastWork: updatedWork,
                        });
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}

                <button
                  className={styles.addWorkButton}
                  onClick={() => setIsModalOpen(true)}
                >
                  + Add another role
                </button>
              </div>
            </div>

            {editWorkIndex !== null && (
              <div
                onClick={() => setEditWorkIndex(null)}
                className={styles.commentsContainer}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className={styles.allCommentsContainer}
                >
                  <input
                    name="company"
                    value={editWorkData.company}
                    onChange={(e) =>
                      setEditWorkData({
                        ...editWorkData,
                        company: e.target.value,
                      })
                    }
                    className={styles.inputField}
                    placeholder="Company"
                  />
                  <input
                    name="position"
                    value={editWorkData.position}
                    onChange={(e) =>
                      setEditWorkData({
                        ...editWorkData,
                        position: e.target.value,
                      })
                    }
                    className={styles.inputField}
                    placeholder="Position"
                  />
                  <input
                    name="years"
                    value={editWorkData.years}
                    onChange={(e) =>
                      setEditWorkData({
                        ...editWorkData,
                        years: e.target.value,
                      })
                    }
                    className={styles.inputField}
                    placeholder="Years"
                  />

                  <div
                    onClick={() => {
                      const updatedWork = [...userProfile.pastWork];
                      updatedWork[editWorkIndex] = editWorkData;
                      setUserProfile({ ...userProfile, pastWork: updatedWork });
                      setEditWorkIndex(null);
                    }}
                    className={styles.updateProfileBtn}
                  >
                    Save Changes
                  </div>
                </div>
              </div>
            )}

            <div className="education">
              <h4>Education</h4>
              <div className={styles.addEducationContainer}>
                {userProfile.education.map((education, index) => (
                  <div key={index} className={styles.workHistoryCard}>
                    <p>
                      <strong>{education.school}</strong>
                    </p>
                    <p>Degree: {education.degree}</p>
                    <p>Field of Study: {education.fieldOfStudy}</p>
                    <button
                      className={styles.editButton}
                      onClick={() => {
                        setEditEduIndex(index);
                        setEditEduData(education);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => {
                        const updatedEdu = userProfile.education.filter(
                          (_, i) => i !== index
                        );
                        setUserProfile({
                          ...userProfile,
                          education: updatedEdu,
                        });
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}

                <button
                  className={styles.addEducationButton}
                  onClick={() => setIsAddEducationOpen(true)}
                >
                  + Add Education
                </button>
              </div>
            </div>

            {editEduIndex !== null && (
              <div
                onClick={() => setEditEduIndex(null)}
                className={styles.commentsContainer}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className={styles.allCommentsContainer}
                >
                  <input
                    name="school"
                    value={editEduData.school}
                    onChange={(e) =>
                      setEditEduData({ ...editEduData, school: e.target.value })
                    }
                    className={styles.inputField}
                    placeholder="School"
                  />
                  <input
                    name="degree"
                    value={editEduData.degree}
                    onChange={(e) =>
                      setEditEduData({ ...editEduData, degree: e.target.value })
                    }
                    className={styles.inputField}
                    placeholder="Degree"
                  />
                  <input
                    name="fieldOfStudy"
                    value={editEduData.fieldOfStudy}
                    onChange={(e) =>
                      setEditEduData({
                        ...editEduData,
                        fieldOfStudy: e.target.value,
                      })
                    }
                    className={styles.inputField}
                    placeholder="Field Of Study"
                  />

                  <div
                    onClick={() => {
                      const updatedEdu = [...userProfile.education];
                      updatedEdu[editEduIndex] = editEduData;
                      setUserProfile({ ...userProfile, education: updatedEdu });
                      setEditEduIndex(null);
                    }}
                    className={styles.updateProfileBtn}
                  >
                    Save Changes
                  </div>
                </div>
              </div>
            )}

            {userProfile !== authState.user && (
              <div
                onClick={updateProfileData}
                className={styles.updateProfileBtn}
              >
                Update Profile
              </div>
            )}
          </div>
        )}

        {isModalOpen && (
          <div
            onClick={() => setIsModalOpen(false)}
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
            onClick={() => setIsAddEducationOpen(false)}
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
