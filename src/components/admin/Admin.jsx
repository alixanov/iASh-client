import React from 'react';
import { Sidebar, Table, Storage } from "../";
import { Route, Routes, useLocation } from 'react-router-dom';
import { Grid, Box } from '@mui/material';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './admin.css';

const Admin = () => {
     const location = useLocation();

     return (
          <Grid container className="admin__container">
               <Sidebar />
               <Grid item xs className="admin__content">
                    <Box className="content__box">
                         <TransitionGroup>
                              <CSSTransition key={location.key} classNames="fade" timeout={300}>
                                   <Routes location={location}>
                                        <Route path='/' element={<Table />} />
                                        <Route path='/storage' element={<Storage />} />
                                   </Routes>
                              </CSSTransition>
                         </TransitionGroup>
                    </Box>
               </Grid>
          </Grid>
     );
};

export default Admin;
