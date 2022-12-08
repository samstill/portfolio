import './App.css';
import { Route, Routes, Link, BrowserRouter, Navigate } from "react-router-dom";
import About from './pages/About';
import Login from './pages/Login';

import Home from './pages/Home';
import Navbar from './components/Navbar';
import Studio from './pages/Studio';
import Updates from './pages/Updates';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Copyright from './components/Copyright';
import { Container } from '@mui/system';


function App() {

const {currentUser} = useContext(AuthContext);
const RequireAuth = ({children}) => {
  return currentUser ? (children) : <Navigate to="/login"/>
}

  return (
    <div className="App">
      <BrowserRouter>
     <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/updates" element={<RequireAuth><Updates /></RequireAuth>} />
          
      </Routes>
      <Copyright sx={{ mt: 4, mb: 4 , background:"black"}} />
      <Navbar/>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
