import { NavLink } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';

function AppBar() {
  return (
    <Navbar expand="md" collapseOnSelect className="neuro-navbar" variant="dark">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/">
          <img
            src="DNA_Icon-white.png"
            alt="Knowledge Logo"
            style={{ height: '30px', width: 'auto' }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="neuro-navbar-nav" />
        <Navbar.Collapse id="neuro-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" style={{ color: 'white' }}>
              Home
            </Nav.Link>

            {/* Dropdown Menu for Workouts */}
            <NavDropdown title="Workouts" id="workouts-dropdown" menuVariant="dark">
              <NavDropdown.Item as={NavLink} to="/create">
                Create
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/favorites">
                Favorites
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/workouts/">
                View
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={NavLink} to="/add-equipment" style={{ color: 'white' }}>
              Add Equipment
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppBar;
