import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./views/Layout/Layout";
import HomePage from "./views/HomePage/HomePage";
import LoginPage from "./views/LoginPage/LoginPage";
import UserPage from "./views/UserPage/UserPage";
import NotesPage from "./views/TradingNotes/NotesPage";

import { useSelector } from "react-redux";

function ProtectRoute({ children }) {
  const { token } = useSelector((store) => store.user);
  let isLogin = false;
  if (token) {
    isLogin = true;
  }

  if (!isLogin) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

function HasLogin({ children }) {
  const { token } = useSelector((store) => store.user);
  let isLogin = false;
  if (token) {
    isLogin = true;
  }

  if (isLogin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <HasLogin>
              <LoginPage />
            </HasLogin>
          }
        ></Route>

        <Route
          path="/"
          element={
            <ProtectRoute>
              <Layout />
            </ProtectRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/tradingNotes" element={<NotesPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
