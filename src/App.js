import './App.css';
import { Route, Routes, Link, BrowserRouter } from "react-router-dom";
import About from './pages/About';


import Home from './pages/Home';
import Navbar from './components/Navbar';
import Studio from './pages/Studio';
import Updates from './pages/Updates';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
     <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/updates" element={<Updates />} />
      </Routes>
      <Navbar/>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
