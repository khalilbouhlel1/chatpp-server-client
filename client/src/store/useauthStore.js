import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5003";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSignedUp: false,
  isSignedIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  checkAuthStatus: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");

      // Set auth user first
      set({
        authUser: response.data.user,
      });
      get().connectSocket();
      return true; // Authentication successful
    } catch (error) {
      set({
        authUser: null,
        isCheckingAuth: false,
        socket: null,
      });
      console.log(error);
      // Only redirect on 401 and if not already on login page
      if (error.response?.status === 401) {
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
      return false; // Authentication failed
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  registerUser: async (formData) => {
    try {
      set({ isSignedUp: true });
      const response = await axiosInstance.post("/auth/register", formData);
      toast.success(response.data.message || "Registration successful!");
      get().connectSocket();
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000); // Give time for toast to show
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      set({ isSignedUp: false });
    }
  },
  loginUser: async (formData) => {
    try {
      set({ isSignedIn: true });
      const response = await axiosInstance.post("/auth/login", formData);
      set({ authUser: response.data.user, isSignedIn: true });
      toast.success(response.data.message || "Logged in successfully!");
      get().connectSocket();
      setTimeout(() => {
        window.location.href = "/";
      }, 2000); // Give time for toast to show
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isSignedIn: false });
    }
  },
  logoutUser: async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success(response.data.message || "Logged out successfully!");
      get().disconnectSocket();
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error logging out");
    }
  },
  updateProfile: async (updateData) => {
    try {
      set({ isUpdatingProfile: true });

      const formData = new FormData();

      // Handle profile picture
      if (updateData.profilepic) {
        formData.append("profilepic", updateData.profilepic);
      }

      // Handle other fields
      if (updateData.fullname) {
        formData.append("fullname", updateData.fullname);
      }

      if (updateData.password) {
        formData.append("password", updateData.password);
      }

      const response = await axiosInstance.put(
        "/profile/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      set((state) => ({
        authUser: response.data.user,
        isUpdatingProfile: false,
      }));

      return response.data;
    } catch (error) {
      set({ isUpdatingProfile: false });
      throw error;
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      toast.error("Connection error. Trying to reconnect...");
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
