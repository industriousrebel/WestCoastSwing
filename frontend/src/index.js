import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import VideoCoachingPlatform from './pages/coach/VideoCoachingPlatform';
import Navbar from './components/header/navbar';
import Home from './pages/user/Home';

// You'll need to create these components
const NewCoachList = () => (
  <div>
    <Navbar />
    <div>New Coach List Page</div>
  </div>
);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/newcoachlist" element={<NewCoachList />} />
        <Route path="/test" element={<VideoCoachingPlatform />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

