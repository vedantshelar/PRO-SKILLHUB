import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DiscoverPage from "./pages/DiscoverPage";
import MyConnectionsPage from "./pages/MyConnectionsPage";
import AllPostsPage from "./pages/AllPosts";
import ProfilePage from "./pages/ProfilePage";
import SigninPage from "./pages/SigninPage";
import SingleProjectPage from "./pages/SingleProjectPage";
import ChatWindow from "./Components/ChatWindow";
function App() {
  return (
    <div id="appMainContainer">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}>
            <Route path="/" element={<AllPostsPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/myConnection" element={<MyConnectionsPage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} /> 
            <Route path="/:userId/:projectId/view" element={<SingleProjectPage />} />
            <Route path="/:senderId/:receiverId/:name/:username/chat" element={<ChatWindow />} />
          </Route>
          <Route path="/signin" element={<SigninPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
