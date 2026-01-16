import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { FiUpload, FiEdit, FiSave, FiX } from "react-icons/fi";

function Profile() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: "" });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/profile/");
      setUser(res.data);
      setForm({ full_name: res.data.full_name });
      if (res.data.profile_photo_url) {
        localStorage.setItem("profilePhoto", res.data.profile_photo_url);
      }
    } catch (err) {
      toast.error("Failed to load profile");
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a photo");
      return;
    }

    const formData = new FormData();
    formData.append("profile_photo", file);

    setLoading(true);
    try {
      const res = await api.patch("/profile-photo/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile photo updated");
      localStorage.setItem("profilePhoto", res.data.profile_photo);
      setFile(null);
      setPreview(null);
      fetchUser();
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.patch("/profile/", form);
      toast.success("Profile updated");
      localStorage.setItem("full_name", res.data.user.full_name);
      setUser(res.data.user);
      setEditing(false);
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ full_name: user.full_name });
    setEditing(false);
  };

  if (!user) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="profile-container">
        <h2 className="page-title">My Profile</h2>

        <div className="profile-card">
          <div className="profile-avatar-section">
            {preview || user.profile_photo_url ? (
              <img
                src={preview || user.profile_photo_url}
                alt="Profile"
                className="profile-preview"
              />
            ) : (
              <div className="profile-placeholder">
                {user.full_name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="photo-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id="photo-input"
                style={{ display: "none" }}
              />
              <label htmlFor="photo-input" className="upload-btn">
                <FiUpload /> Choose Photo
              </label>
              {file && (
                <button onClick={handleUpload} disabled={loading} className="save-btn">
                  <FiSave /> {loading ? "Uploading..." : "Upload"}
                </button>
              )}
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <label>Email</label>
              <p>{user.email}</p>
            </div>

            <div className="detail-item">
              <label>Full Name</label>
              {editing ? (
                <div className="edit-group">
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={(e) => setForm({ full_name: e.target.value })}
                  />
                  <button onClick={handleSave} disabled={loading}>
                    <FiSave />
                  </button>
                  <button onClick={handleCancel}>
                    <FiX />
                  </button>
                </div>
              ) : (
                <div className="display-group">
                  <p>{user.full_name}</p>
                  <button onClick={handleEdit}>
                    <FiEdit />
                  </button>
                </div>
              )}
            </div>

            <div className="detail-item">
              <label>Member Since</label>
              <p>{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
