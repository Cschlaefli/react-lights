import './App.css';
import Devices from './components/devices/devices';
import Configs from './components/config/configs';
import { Nav, Navbar, NavbarBrand, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
    <Container>
          <Navbar sticky='top' expand='lg' style={{width:"100%"}} bg='dark' variant='dark'>
            <Container>
              <NavbarBrand>Home</NavbarBrand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">

              <Nav variant='pills' className='me-auto bg-dark text-light'>
                <Nav.Item>
                  <LinkContainer to="devices">
                    <Nav.Link>
                      Devices
                    </Nav.Link>
                  </LinkContainer>
                </Nav.Item>
                <Nav.Item>
                  <LinkContainer to="config">
                    <Nav.Link>
                      Configs
                    </Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
      <div>

          <Routes>
            <Route path="/" element={<Devices/>} />
            <Route path="/devices" element={<Devices/>} />
            <Route path="/config" element={<Configs/>} />
          </Routes>
      </div>
    </Container>
    </div>
    </BrowserRouter>
  );
}

export default App;
