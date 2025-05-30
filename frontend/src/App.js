import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VideoCoachingPlatform from './pages/coach/VideoCoachingPlatform';
import Home from './pages/user/Home';
import Coaches from './pages/user/Coaches';
import Upload from './pages/user/Upload';
import Profile from './pages/user/Profile';
import Auth0Wrapper from './components/authentication/auth0';
import { ApiProvider } from './context/context';

function App() {
  return (
    <Router>
      <Auth0Wrapper>
        <ApiProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/newcoachlist" element={<Coaches/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/test" element={<VideoCoachingPlatform />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </ApiProvider>
      </Auth0Wrapper>
    </Router>
  );
}

export default App;