import './App.css';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { NameSearchWrapper } from './views/NameSearch/NameSearchWrapper';
import { AddressSearchWrapper } from './views/AddressSearch/AddressSearchWrapper';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const drawerWidth = 240;

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
          <Toolbar>
            <Typography variant="h5" noWrap component="div">
              Porovnání názvů
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Divider />
          <List>
            <ListItem disablePadding>
              <Link to="/">
                <ListItemButton>
                  <ListItemText primary="Porovnat názvy" />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link to="/address_comparison">
                <ListItemButton>
                  <ListItemText primary="Porovnat adresy" />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <a href="https://ares.gov.cz/ekonomicke-subjekty" target="_blank">
                  <ListItemText primary="ARES" />
                </a>
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<NameSearchWrapper />} />
            <Route path="/address_comparison" element={<AddressSearchWrapper />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
