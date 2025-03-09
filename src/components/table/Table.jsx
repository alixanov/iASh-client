import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, IconButton, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Pagination, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, useMediaQuery, useTheme } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Edit, Delete, QrCode2 } from '@mui/icons-material';
import axios from 'axios';
import { AddModal, BarcodeModal } from '../'; // Убедитесь, что путь к компонентам правильный
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom'; // Импортируйте useNavigate для перенаправления

const CustomTableWithNavbar = () => {
     const [items, setItems] = useState([]);
     const [deleteState, setDeleteState] = useState(false);
     const [isLoading, setIsLoading] = useState(false);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
     const [selectedItem, setSelectedItem] = useState(null);
     const [currentPage, setCurrentPage] = useState(1);
     const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
     const [itemToDelete, setItemToDelete] = useState(null);
     const itemsPerPage = 5;
     const navigate = useNavigate();
     const theme = useTheme();
     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

     useEffect(() => {
          const fetchData = async () => {
               setIsLoading(true);
               try {
                    const response = await axios.get("https://i-ash-server.vercel.app/api/getall");
                    setItems(response.data);
               } catch (error) {
                    console.error("Ошибка при загрузке данных:", error);
               } finally {
                    setIsLoading(false);
               }
          };
          fetchData();
     }, [deleteState]);

     const handleDelete = async (id) => {
          setIsLoading(true);
          try {
               await axios.delete(`https://i-ash-server.vercel.app/api/delete/${id}`);
               setDeleteState(prev => !prev);
          } catch (error) {
               console.error("Ошибка при удалении продукта:", error);
          } finally {
               setIsLoading(false);
               setOpenDeleteDialog(false);
          }
     };

     const handleEdit = (item) => {
          setSelectedItem(item);
          setIsModalOpen(true);
     };

     const handleOpenBarcodeModal = (item) => {
          setSelectedItem(item);
          setIsBarcodeModalOpen(true);
     };

     const handleCloseModal = () => {
          setIsModalOpen(false);
          setSelectedItem(null);
     };

     const handleCloseBarcodeModal = () => {
          setIsBarcodeModalOpen(false);
          setSelectedItem(null);
     };

     const handleLogout = () => {
          localStorage.clear();
          navigate('/login');
     };

     const handleOpenDeleteDialog = (id) => {
          setItemToDelete(id);
          setOpenDeleteDialog(true);
     };

     const handleCloseDeleteDialog = () => {
          setOpenDeleteDialog(false);
          setItemToDelete(null);
     };

     const indexOfLastItem = currentPage * itemsPerPage;
     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
     const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
     const totalPages = Math.ceil(items.length / itemsPerPage);

     const handlePageChange = (event, value) => {
          setCurrentPage(value);
     };

     return (
          <Box sx={{
               padding: isMobile ? 1 : 3,
               marginTop: isMobile ? "10px" : 3,
          }}>
               <AppBar position="static" sx={{ backgroundColor: '#2c3e50', padding: 1, marginTop: -3, borderRadius: '8px' }}>
                    <Toolbar>
                         <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "end", gap: 1 }}>
                              <IconButton
                                   onClick={() => setIsModalOpen(true)}
                                   sx={styles.submitButton}
                              >
                                   <AddCircleOutlineIcon />
                              </IconButton>
                              <IconButton
                                   sx={styles.exitButton}
                                   onClick={handleLogout}
                              >
                                   <ExitToAppIcon />
                              </IconButton>
                         </Box>
                    </Toolbar>
               </AppBar>

               {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                         <CircularProgress />
                    </Box>
               ) : (
                    <>
                         <TableContainer component={Paper} sx={{ backgroundColor: '#34495e', color: '#ecf0f1', marginTop: 2, borderRadius: '8px' }}>
                              <Table>
                                   <TableHead>
                                        <TableRow>
                                             <TableCell align="center" sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>#</TableCell>
                                             <TableCell align="center" sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Название</TableCell>
                                             {!isMobile && (
                                                  <>
                                                       <TableCell align="center" sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Цена</TableCell>
                                                       <TableCell align="center" sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Количество</TableCell>
                                                  </>
                                             )}
                                             <TableCell align="center" sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Штрих-код</TableCell>
                                             <TableCell align="center" sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Действия</TableCell>
                                        </TableRow>
                                   </TableHead>
                                   <TableBody>
                                        {currentItems.map((item, index) => (
                                             <TableRow
                                                  key={index}
                                                  sx={{
                                                       '&:last-child td, &:last-child th': { border: 0 },
                                                       '&:hover': { backgroundColor: '#2c3e50', cursor: 'pointer' },
                                                  }}
                                             >
                                                  <TableCell align="center" sx={{ color: '#ecf0f1' }}>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                                                  <TableCell align="center" sx={{ color: '#ecf0f1' }}>{item.nomi}</TableCell>
                                                  {!isMobile && (
                                                       <>
                                                            <TableCell align="center" sx={{ color: '#ecf0f1' }}>{item.kelgannarxi}</TableCell>
                                                            <TableCell align="center" sx={{ color: '#ecf0f1' }}>{item.soni} {item.unit === 'kg' ? 'кг' : 'шт'}</TableCell>
                                                       </>
                                                  )}
                                                  <TableCell align="center">
                                                       <IconButton onClick={() => handleOpenBarcodeModal(item)} sx={{ color: '#ecf0f1' }}>
                                                            <QrCode2 />
                                                       </IconButton>
                                                  </TableCell>
                                                  <TableCell align="center">
                                                       <IconButton onClick={() => handleEdit(item)} sx={{ color: '#ecf0f1' }}>
                                                            <Edit />
                                                       </IconButton>
                                                       <IconButton onClick={() => handleOpenDeleteDialog(item._id)} sx={{ color: '#e74c3c' }}>
                                                            <Delete />
                                                       </IconButton>
                                                  </TableCell>
                                             </TableRow>
                                        ))}
                                   </TableBody>
                              </Table>
                         </TableContainer>

                         <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 1 }}>
                              <Pagination
                                   count={totalPages}
                                   page={currentPage}
                                   onChange={handlePageChange}
                                   color="primary"
                                   size={isMobile ? "small" : "medium"}
                                   sx={{
                                        '& .MuiPaginationItem-root': {
                                             '&:hover': {
                                                  backgroundColor: '#2C3E50',
                                                  color: '#ffffff',
                                             },
                                        },
                                        '& .Mui-selected': {
                                             backgroundColor: '#2C3E50 !important',
                                             color: '#ffffff',
                                        }
                                   }}
                              />
                         </Box>
                    </>
               )}

               {isModalOpen && (
                    <AddModal
                         onClose={handleCloseModal}
                         product={selectedItem}
                         onUpdate={() => setDeleteState(prev => !prev)}
                    />
               )}

               {isBarcodeModalOpen && (
                    <BarcodeModal
                         onClose={handleCloseBarcodeModal}
                         product={selectedItem}
                    />
               )}

               <Dialog
                    open={openDeleteDialog}
                    onClose={handleCloseDeleteDialog}
               >
                    <DialogTitle>Удаление продукта</DialogTitle>
                    <DialogContent>
                         <DialogContentText>
                              Вы уверены, что хотите удалить этот продукт?
                         </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                         <Button onClick={handleCloseDeleteDialog} color="primary">
                              Отмена
                         </Button>
                         <Button onClick={() => handleDelete(itemToDelete)} color="secondary">
                              Удалить
                         </Button>
                    </DialogActions>
               </Dialog>
          </Box>
     );
};

const styles = {
     submitButton: {
          backgroundColor: '#00796B',
          transition: 'background-color 0.3s ease',
          '&:hover': {
               backgroundColor: '#004D40',
          },
          borderRadius: 2,
     },
     exitButton: {
          backgroundColor: '#e84e3c',
          transition: 'background-color 0.3s ease',
          '&:hover': {
               backgroundColor: '#97362c',
          },
          borderRadius: 2,
     }
};

export default CustomTableWithNavbar;