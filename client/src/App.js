import './App.css';
import React,{Component} from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom';

//Import our custom components
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

function App() {
  return (
    <Router>
    <div>
      <Navbar/>
      <Route exact path="/" component={Landing}/>
      <Route exact path="/register" component={Register}/>
      <Route exact path="/login" component={Login}/>
    </div>
    </Router>
  );
}

export default App;
