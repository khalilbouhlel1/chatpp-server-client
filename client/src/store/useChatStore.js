import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserListLoading: false,
  isMessageListLoading: false,

  getUsers: async () => {
    try {
      set({ isUserListLoading: true });
      const { data } = await axiosInstance.get("/messages/users");
      set({ users: data, isUserListLoading: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching users");
      set({ isUserListLoading: false });
    }
  },

  getMessages: async (userId) => {
    try {
      set({ isMessageListLoading: true });
      const { data } = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: data, isMessageListLoading: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching messages");
      set({ isMessageListLoading: false });
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket?.connected) {
      console.error("Socket not connected");
      toast.error("Connection error. Please refresh the page.");
      return;
    }
    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();
      if (!selectedUser) return;

      const isMessageRelevant =
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id;

      if (isMessageRelevant) {
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  sendMessage: async (messageData) => {
    try {
      const { selectedUser } = get();
      if (!selectedUser) {
        throw new Error("No user selected");
      }

      const response = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        {
          text: messageData.text,
          image: messageData.image,
        }
      );

      set((state) => ({
        messages: [...state.messages, response.data],
      }));

      return response.data;
    } catch (error) {
      console.error("Send message error:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
      throw error;
    }
  },
}));
