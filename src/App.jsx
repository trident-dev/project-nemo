import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Background from './components/layout/Background';
import Home from './pages/Home';
import Day1Sup from './components/games/Day1Sup';
import Day2Shield from './components/games/Day2Shield';
import Day3Food from './components/games/Day3Food';
import Day4Drive from './components/games/Day4Drive';
import Day5Queen from './components/games/Day5Queen';
import Day6Proposal from './components/games/Day6Proposal';

function App() {
  return (
    <Router>
      <Background />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/day/1" element={<Day1Sup />} />
        {/* <Route path="/day/2" element={<Day2Shield />} />
        <Route path="/day/3" element={<Day3Food />} />
        <Route path="/day/4" element={<Day4Drive />} />
        <Route path="/day/5" element={<Day5Queen />} />
        <Route path="/day/6" element={<Day6Proposal />} /> */}
        <Route path="/day/:id" element={<div className="container"><h2>Day Content Coming Soon</h2></div>} />
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
