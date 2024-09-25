import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, CssBaseline, Box } from '@mui/material';
import { Home,  Menu, ChevronLeft } from '@mui/icons-material';
import "./sidebar.css"
import TextSnippetIcon from '@mui/icons-material/TextSnippet';


const Sidebar = () => {
     const [open, setOpen] = useState(true);

     const handleDrawerToggle = () => {
          setOpen(!open);
     };

     return (
          <Box sx={{ display: 'flex' }}>
               <CssBaseline />
               <Drawer
                    variant="permanent"
                    open={open}
                    sx={{
                         width: open ? 240 : 60,
                         transition: 'width 0.3s ease',
                         flexShrink: 0,
                         '& .MuiDrawer-paper': {
                              width: open ? 240 : 60,
                              boxSizing: 'border-box',
                              backgroundColor: '#2c3e50',
                              color: '#ffffff',
                              overflowX: 'hidden',
                              transition: 'width 0.3s ease',
                         },
                    }}
               >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: open ? 'flex-end' : 'center', padding: 1 }}>
                         <IconButton onClick={handleDrawerToggle} sx={{ color: '#ffffff' }}>
                              {open ? <ChevronLeft /> : <Menu />}
                         </IconButton>
                    </Box>
                    <List>
                         <ListItem button component={NavLink} to="/" exact>
                              <ListItemIcon>
                                   <Home sx={{ color: '#ffffff' }} />
                              </ListItemIcon>
                              {open && <ListItemText primary="Администратор" />}
                         </ListItem>

                         <ListItem button component={NavLink} to="/storage">
                              <ListItemIcon>
                                   <TextSnippetIcon sx={{ color: '#ffffff' }} />
                              </ListItemIcon>
                              {open && <ListItemText primary="Склад" />}
                         </ListItem>
                    </List>
               </Drawer>
               <Box
                    component="main"
                    sx={{
                         flexGrow: 1,
                         p: 3,
                         marginLeft: '-60px', // Устанавливаем фиксированное расстояние между сайдбаром и контентом
                    }}
               >
                    {/* Контент будет здесь */}
               </Box>
          </Box>
     );
};

export default Sidebar;
