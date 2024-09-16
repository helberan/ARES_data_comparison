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
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { NameSearchWrapper } from './views/NameSearch/NameSearchWrapper';
import { AddressSearchWrapper } from './views/AddressSearch/AddressSearchWrapper';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ScrollToTop from 'react-scroll-to-top';

const drawerWidth = 240;

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
          <Toolbar>
            <Typography variant="h5" noWrap component="div">
              Porovnání sujektů s ARES
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
              <Link to="/ARES_data_comparison" style={{ textDecoration: 'none', width: '100%', color: 'black' }}>
                <ListItemButton sx={{ width: '100%' }}>
                  <ListItemText primary="Porovnat názvy" />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link to="/ARES_data_comparison/address_comparison" style={{ textDecoration: 'none', width: '100%', color: 'black' }}>
                <ListItemButton sx={{ width: '100%' }}>
                  <ListItemText primary="Porovnat adresy" />
                </ListItemButton>
              </Link>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <a href="https://ares.gov.cz/ekonomicke-subjekty" target="_blank" style={{ textDecoration: 'none', width: '100%', color: 'black' }}>
                <ListItemButton sx={{ width: '100%' }}>
                  <ListItemText primary="ARES" />
                  <ArrowOutwardIcon sx={{ color: 'gray' }} />
                </ListItemButton>
              </a>
            </ListItem>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
          <Toolbar />
          <Routes>
            <Route path="/ARES_data_comparison" element={<NameSearchWrapper />} />
            <Route path="/ARES_data_comparison/address_comparison" element={<AddressSearchWrapper />} />
          </Routes>
        </Box>
        <ScrollToTop />
      </Box>
    </Router>
  );
}

export default App;
