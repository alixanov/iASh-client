import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, IconButton, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Pagination } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Edit, Delete, QrCode2 } from '@mui/icons-material';
import axios from 'axios';
import { AddModal, BarcodeModal } from '../'; // Убедитесь, что путь к компонентам правильный

const CustomTableWithNavbar = () => {
     const [items, setItems] = useState([]); // Состояние для хранения данных
     const [deleteState, setDeleteState] = useState(false); // Состояние для контроля обновления данных после удаления
     const [isLoading, setIsLoading] = useState(false); // Состояние для отображения загрузчика
     const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для отображения модального окна
     const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false); // Состояние для отображения модального окна штрих-кода
     const [selectedItem, setSelectedItem] = useState(null); // Состояние для выбранного продукта
     const [currentPage, setCurrentPage] = useState(1);
     const itemsPerPage = 5; // Количество продуктов на странице

     useEffect(() => {
          setIsLoading(true); // Устанавливаем состояние загрузки
          axios.get("https://i-ash-server.vercel.app/api/getall")
               .then(response => {
                    setItems(response.data); // Сохраняем полученные данные в состоянии
                    setIsLoading(false); // Сбрасываем состояние загрузки
               })
               .catch(error => {
                    console.log("Ошибка", error);
                    setIsLoading(false); // Сбрасываем состояние загрузки в случае ошибки
               });
     }, [deleteState]); // Обновляем данные при изменении deleteState

     const handleDelete = (id) => {
          setIsLoading(true); // Устанавливаем состояние загрузки
          axios.delete(`https://i-ash-server.vercel.app/api/delete/${id}`)
               .then(res => {
                    setIsLoading(false); // Сбрасываем состояние загрузки
                    setDeleteState(prev => !prev); // Обновляем состояние, чтобы перезагрузить данные
               })
               .catch(error => {
                    console.error("Ошибка при удалении продукта:", error);
                    setIsLoading(false); // Сбрасываем состояние загрузки в случае ошибки
               });
     };

     const handleEdit = (item) => {
          setSelectedItem(item); // Устанавливаем выбранный продукт для редактирования
          setIsModalOpen(true); // Открываем модальное окно редактирования
     };

     const handleOpenBarcodeModal = (item) => {
          setSelectedItem(item); // Устанавливаем выбранный продукт для отображения штрих-кода
          setIsBarcodeModalOpen(true); // Открываем модальное окно штрих-кода
     };

     const handleCloseModal = () => {
          setIsModalOpen(false); // Закрываем модальное окно редактирования
          setSelectedItem(null); // Сбрасываем выбранный продукт
     };

     const handleCloseBarcodeModal = () => {
          setIsBarcodeModalOpen(false); // Закрываем модальное окно штрих-кода
          setSelectedItem(null); // Сбрасываем выбранный продукт
     };

     // Логика для определения продуктов, которые будут отображаться на текущей странице
     const indexOfLastItem = currentPage * itemsPerPage;
     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
     const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
     const totalPages = Math.ceil(items.length / itemsPerPage);

     const handlePageChange = (event, value) => {
          setCurrentPage(value);
     };

     return (
          <Box sx={{ padding: 3 }}>
               {/* Navbar */}
               <AppBar position="static" sx={{ backgroundColor: '#2c3e50', padding: 1, marginTop: -3, borderRadius: '8px' }}>
                    <Toolbar>
                         <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "end" }}>
                              <Button
                                   variant="contained"
                                   // color="primary"
                                   startIcon={<AddCircleOutlineIcon />}
                                   onClick={() => setIsModalOpen(true)}
                                   sx={styles.submitButton}

                                   // sx={{ backgroundColor: '#2980b9', '&:hover': { backgroundColor: '#3498db' } }}
                              >
                                   Махсулот қушиш
                              </Button>
                         </Box>
                    </Toolbar>
               </AppBar>

               {/* Table */}
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
                                             <TableCell align="center" sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Махсулот номи</TableCell>
                                             <TableCell align="center" sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Келиш нархи</TableCell>
                                             <TableCell align="center" sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Сотиш нархи</TableCell>
                                             <TableCell align="center" sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Микдори</TableCell>
                                             <TableCell align="center" sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Штрих код</TableCell>
                                             <TableCell align="center" sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Харакатлар</TableCell>
                                        </TableRow>
                                   </TableHead>
                                        <TableBody>
                                             {currentItems.map((item, index) => (
                                                  <TableRow
                                                       key={index}
                                                       sx={{
                                                            '&:last-child td, &:last-child th': { border: 0 },
                                                            '&:hover': { backgroundColor: '#2c3e50', cursor: 'pointer' }, // Эффект при наведении
                                                       }}
                                                  >
                                                       <TableCell align="center" sx={{ color: '#ecf0f1' }}>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                                                       <TableCell align="center" sx={{ color: '#ecf0f1' }}>{item.nomi}</TableCell>
                                                       <TableCell align="center" sx={{ color: '#ecf0f1' }}>{item.kelgannarxi}</TableCell>
                                                       <TableCell align="center" sx={{ color: '#ecf0f1' }}>{item.sotishnarxi}</TableCell>
                                                       <TableCell align="center" sx={{ color: '#ecf0f1' }}>
                                                            {item.soni} {item.unit === 'kg' ? 'кг' : 'шт'}
                                                       </TableCell>
                                                       <TableCell align="center">
                                                            <IconButton onClick={() => handleOpenBarcodeModal(item)} sx={{ color: '#ecf0f1' }}>
                                                                 <QrCode2 />
                                                            </IconButton>
                                                       </TableCell>
                                                       <TableCell align="center">
                                                            <IconButton onClick={() => handleEdit(item)} sx={{ color: '#ecf0f1' }}>
                                                                 <Edit />
                                                            </IconButton>
                                                            <IconButton onClick={() => handleDelete(item._id)} sx={{ color: '#e74c3c' }}>
                                                                 <Delete />
                                                            </IconButton>
                                                       </TableCell>
                                                  </TableRow>
                                             ))}
                                        </TableBody>

                              </Table>
                         </TableContainer>

                         {/* Пагинация */}
                         <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 1 }}>
                              <Pagination
                                   count={totalPages}
                                   page={currentPage}
                                   onChange={handlePageChange}
                                   color="primary"
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

               {/* Модальное окно для редактирования продукта */}
               {isModalOpen && (
                    <AddModal
                         onClose={handleCloseModal}
                         product={selectedItem} // Передаем выбранный продукт в модальное окно
                         onUpdate={() => setDeleteState(prev => !prev)} // Обновляем данные после редактирования
                    />
               )}

               {/* Модальное окно для отображения штрих-кода продукта */}
               {isBarcodeModalOpen && (
                    <BarcodeModal
                         onClose={handleCloseBarcodeModal}
                         product={selectedItem} // Передаем выбранный продукт в модальное окно штрих-кода
                    />
               )}
          </Box>
     );
};

const styles = {
     submitButton: {
          backgroundColor: '#00796B', // Teal
          '&:hover': {
               backgroundColor: '#004D40', // Dark teal
          },
          borderRadius: 2,
     }
}

export default CustomTableWithNavbar;
