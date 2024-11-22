import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
import Footer from "./components/Footer";
import { useThemeStore } from "./store/useThemeStore";
const App = () => {
  const { authUser, checkAuthStatus, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log(onlineUsers);
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await checkAuthStatus();
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    initializeApp();
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader className="w-10 h-10 animate-spin text-primary" />
          <h1 className="text-xl font-medium">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4aed88',
            },
          },
          error: {
            duration: 3000,
            theme: {
              primary: '#ff4b4b',
            },
          },
        }}
      />
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/register" element={!authUser ? <RegisterPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
