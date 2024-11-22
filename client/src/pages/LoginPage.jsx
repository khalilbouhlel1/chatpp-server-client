import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  MessageSquare,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { loginUser, isSignedIn } = useAuthStore();

  const validateFormData = () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields", {
        id: 'validation-error',
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address", {
        id: 'email-validation',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFormData()) {
      loginUser(formData);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* logo and title */}
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
              <MessageSquare className="size-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to your account
            </p>
          </div>
          {/* form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="john@doe.com"
                  className="input input-bordered w-full pl-10"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-control">
              <label htmlFor="password" className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="********"
                  className="input input-bordered w-full pl-10"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSignedIn}
            >
              {isSignedIn ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span className="ml-2">Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-500">
            <p className="text-base-content/60">
              Don't have an account?{" "}
              <Link to="/register" className="link link-primary">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* right side */}
      <AuthImagePattern
        title="Connect with friends"
        subtitle="Stay connected with your friends and family"
        textColor="text-violet-500"
        reverse={false}
        className="hidden lg:block"
      />
    </div>
  );
};

export default LoginPage;