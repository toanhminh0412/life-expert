import './App.css';
import React from 'react';
import {BrowserRouter as Router, Routes, Route } from "react-router-dom"; 

import Dashboard from './components/Dashboard';
import BudgetManager from './components/BudgetManager';
import Scheduler from './components/Scheduler';
import NavigationBar from './components/NavigationBar';

function App() {
  return (
    <div className="App">
      <Router>
        <NavigationBar />
        <Routes>
          <Route exact path='/' element={<Dashboard/>}/>
          <Route exact path='/budget-manager' element={<BudgetManager/>}/>
          <Route exact path='/scheduler' element={<Scheduler/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;