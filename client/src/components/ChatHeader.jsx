import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-3 border-b border-base-200 bg-base-100/95 backdrop-blur 
      supports-backdrop-blur:bg-base-100/50 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-11 rounded-full ring-2 ring-base-300 p-0.5">
              <img 
                src={selectedUser.profilepic || "/avatar.png"} 
                alt={selectedUser.fullName}
                className="rounded-full object-cover"
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium leading-tight">{selectedUser.fullName}</h3>
            <p className="text-sm">
              {onlineUsers.includes(selectedUser._id) ? (
                <span className="flex items-center gap-1.5 text-success">
                  <span className="size-2 bg-success rounded-full animate-pulse" />
                  Online
                </span>
              ) : (
                <span className="text-base-content/60">Offline</span>
              )}
            </p>
          </div>
        </div>

        <button 
          onClick={() => setSelectedUser(null)}
          className="btn btn-ghost btn-sm btn-circle hover:bg-base-200"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;