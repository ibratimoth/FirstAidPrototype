import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Pagenotfound from "./pages/Pagenotfound";
import Login from "./pages/Auth/Login";
// import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Routes/Private";
import CreateCategory from "./pages/user/CreateCategory";
import CreateContent from "./pages/user/CreateContent";
import CreatedContent from "./pages/user/CreatedContent";
import ContentDetails from "./pages/user/ContentDetails";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="user" element={<Dashboard />} />
          <Route path="user/create-category" element={<CreateCategory />} />
          <Route path="user/create-content" element={<CreateContent />} />
          <Route path="user/All-contents" element={<CreatedContent />} />
          <Route path="user/content" element={<ContentDetails />} />
        </Route>
        <Route path="/Login" element={<Login />} />
        <Route path="/*" element={<Pagenotfound />} />
      </Routes>
    </>
  );
}

export default App;
