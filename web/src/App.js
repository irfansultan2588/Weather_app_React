import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Compoenets/Home';
import Contact from './Compoenets/Contact';
import About from './Compoenets/About';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Login from './Compoenets/Login';
import Signup from './Compoenets/Signup';

function App() {
  return (
    <Router>

      <nav className='nav_2'>
        <ul>

          <li> <Link to="/">Home</Link> </li>
          <li><Link to="/about">About</Link> </li>
          <li><Link to="/Contact">Contact</Link></li>
          <li><Link to="/Login">Login</Link></li>
          <li><Link to="/Signup">Signup</Link></li>

        </ul>
      </nav>



      <Routes>


        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/" element={<Home />} />

      </Routes>

    </Router >

  );











}

export default App;
