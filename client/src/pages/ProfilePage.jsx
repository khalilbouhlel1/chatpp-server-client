import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Pencil, X, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: authUser?.fullname || "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      try {
        const base64Image = reader.result;
        setSelectedImg(base64Image);
        await updateProfile({ profilepic: base64Image });
        toast.success("Profile picture updated successfully");
      } catch (error) {
        toast.error("Failed to update profile picture");
        setSelectedImg(null);
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const updateData = {
        fullname: formData.fullname,
        ...(formData.password && { password: formData.password }),
      };

      await updateProfile(updateData);
      toast.success("Profile updated successfully");
      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="h-[calc(100vh-4rem)] pt-16 px-4 overflow-y-auto">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {/* Left Column - Profile Picture & Basic Info */}
        <div className="md:col-span-1">
          <div className="bg-base-200 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={selectedImg || authUser?.profilepic || "/avatar.png"}
                  alt="Profile"
                  className="size-28 rounded-full object-cover border-4 border-base-100"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 
                    bg-base-content hover:scale-105
                    p-2 rounded-full cursor-pointer 
                    transition-all duration-200
                    ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
                >
                  <Camera className="size-4 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{authUser?.fullname}</h2>
                <p className="text-sm text-base-content/70">{authUser?.email}</p>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-base-300">
                <span className="text-base-content/70">Member Since</span>
                <span>{formatDate(authUser?.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-base-content/70">Account Status</span>
                <span className="badge badge-success badge-sm">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Edit Form */}
        <div className="md:col-span-2">
          <div className="bg-base-200 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-ghost btn-sm"
              >
                {isEditing ? (
                  <X className="size-4" />
                ) : (
                  <Pencil className="size-4" />
                )}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="form-control">
                  <label className="label" htmlFor="fullname">
                    <span className="label-text">Full Name</span>
                  </label>
                  {isEditing ? (
                    <input
                      id="fullname"
                      type="text"
                      value={formData.fullname}
                      onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                      className="input input-bordered"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="input input-bordered bg-base-300 flex items-center">{authUser?.fullname}</p>
                  )}
                </div>

                <div className="form-control">
                  <label className="label" htmlFor="email">
                    <span className="label-text">Email Address</span>
                  </label>
                  <p className="input input-bordered bg-base-300 flex items-center">{authUser?.email}</p>
                </div>

                {isEditing && (
                  <>
                    <div className="form-control">
                      <label className="label" htmlFor="newPassword">
                        <span className="label-text">New Password</span>
                      </label>
                      <div className="relative">
                        <input
                          id="newPassword"
                          type={showPassword.password ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="input input-bordered w-full"
                          placeholder="Leave blank to keep current"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showPassword.password ? (
                            <EyeOff className="size-4 text-base-content/70" />
                          ) : (
                            <Eye className="size-4 text-base-content/70" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label" htmlFor="confirmPassword">
                        <span className="label-text">Confirm Password</span>
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          type={showPassword.confirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="input input-bordered w-full"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showPassword.confirmPassword ? (
                            <EyeOff className="size-4 text-base-content/70" />
                          ) : (
                            <Eye className="size-4 text-base-content/70" />
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {isEditing && (
                <button
                  type="submit"
                  className="btn btn-primary w-full mt-6"
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;