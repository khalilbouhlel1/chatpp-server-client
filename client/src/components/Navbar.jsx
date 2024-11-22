import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logoutUser, authUser } = useAuthStore();

  return (
    <header className="bg-base-100/80 border-b border-base-200 fixed w-full top-0 z-40 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-all">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="size-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-focus bg-clip-text text-transparent">
              ChatAppByKhalil
            </h1>
          </Link>

          <div className="flex items-center gap-3">
            {authUser && (
              <>
                <Link
                  to="/settings"
                  className="btn btn-ghost btn-sm gap-2 hover:bg-base-200"
                >
                  <Settings className="size-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Link>

                <Link
                  to="/profile"
                  className="btn btn-ghost btn-sm gap-2 hover:bg-base-200"
                >
                  <User className="size-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  onClick={logoutUser}
                  className="btn btn-error btn-sm gap-2 text-white"
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;