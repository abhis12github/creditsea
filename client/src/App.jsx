import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Test from './pages/Test';

function App() {
  return (
    <Router>
      <Routes>
          <Route path='/' element={<Test/>} />
      </Routes>
    </Router>
  );
}

export default App;