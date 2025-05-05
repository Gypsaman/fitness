import { NavLink } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function AppBar() {
  return (
    <Navbar className="neuro-navbar">
      <Navbar.Brand as={NavLink} to="/">
        <img
          src="DNA_Icon-white.png"
          alt="Knowledge Logo"
          style={{ height: '30px', width: 'auto' }}
        />
      </Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link as={NavLink} to="/" style={{ color: 'white' }}>
          Home
        </Nav.Link>
        <Nav.Link as={NavLink} to="/create" style={{ color: 'white' }}>
          Create
        </Nav.Link>
        <Nav.Link as={NavLink} to="/workouts" style={{ color: 'white' }}>
          Workouts
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default AppBar;
