import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreateForm from "./pages/CreateForm";
import CreateEmployee from "./pages/CreateEmployee";
import Header from "./components/Header";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken"),
  );

  return (
    <BrowserRouter>
      {isAuthenticated && <Header setIsAuthenticated={setIsAuthenticated} />}
      <Routes>
        <Route
          path="/signin"
          element={<SignIn setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/signin" />}
        />
        <Route
          path="/create-form"
          element={isAuthenticated ? <CreateForm /> : <Navigate to="/signin" />}
        />
        <Route
          path="/create-employee"
          element={
            isAuthenticated ? <CreateEmployee /> : <Navigate to="/signin" />
          }
        />
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/signin" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
