import './App.css';
import React from 'react';
import {BrowserRouter as Router, Routes, Route } from "react-router-dom"; 

import Dashboard from './components/Dashboard';
import Budget from './components/Budget';
import BudgetAdd from './components/BudgetAdd';
import Scheduler from './components/Scheduler';
import NavigationBar from './components/NavigationBar';
import Login from './components/Login';
import Signup from './components/Signup';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"; 
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOvYXyQ-nGYpMxcTX_vdy9Bg6AlCF6Nwg",
  authDomain: "life-expert.firebaseapp.com",
  projectId: "life-expert",
  storageBucket: "life-expert.appspot.com",
  messagingSenderId: "1008640937279",
  appId: "1:1008640937279:web:cdbd1417c99b7541a8978a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();

function App() {
  return (
    <div className="App">
      <Router>
        <NavigationBar />
        <Routes>
          <Route exact path='/' element={<Dashboard/>}/>
          <Route exact path='/budget-manager' element={<Budget/>}/>
          <Route path='/budget-manager/add' element={<BudgetAdd/>}/>
          <Route exact path='/scheduler' element={<Scheduler/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='signup' element={<Signup/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;