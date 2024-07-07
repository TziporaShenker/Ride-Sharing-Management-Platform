import React, { useEffect, createContext, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ResetPassword from "./pages/ResetPassword";
import "./App.css";
import sendRefreshToken from "./components/SendRefreshToken";

export const UserContext = createContext();

const AppContent = () => {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:3000/someEndpoint", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.log("401");
          const result = await sendRefreshToken();
         await fetchUserData();
        }
      } else {
        console.log("else");
        const data = await response.json();
        console.log(data);
        setUser(data);
      }
    } catch (error) {
      console.log(error);
      if (error.message === "440") {
        navigate("/login"); // זרוק מחדש את השגיאה כדי שהפונקציה הקוראת תטפל בה
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home/*" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
      </Routes>
    </UserContext.Provider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
