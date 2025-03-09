import React, { useState } from 'react';
import CustomTableWithNavbar from './CustomTableWithNavbar';
import Sidebar from './Sidebar';

const ParentComponent = () => {
     const [sidebarOpen, setSidebarOpen] = useState(true);

     const handleLogout = () => {
          localStorage.clear();
          setSidebarOpen(false); // Закрываем сайдбар при выходе
     };

     return (
          <Box sx={{ display: 'flex' }}>
               <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
               <CustomTableWithNavbar handleLogout={handleLogout} />
          </Box>
     );
};

export default ParentComponent;