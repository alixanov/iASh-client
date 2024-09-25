import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BarcodeModal } from "../";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Pagination, TextField, InputAdornment } from '@mui/material';
import { Add, Remove, CheckCircle, QrCode2, Search } from '@mui/icons-material';

const Seller = () => {
     const [items, setItems] = useState([]);
     const [searchQuery, setSearchQuery] = useState("");
     const [selectedCounts, setSelectedCounts] = useState({});
     const [selectedItem, setSelectedItem] = useState(null);
     const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
     const [currentPage, setCurrentPage] = useState(1);
     const itemsPerPage = 4;
     const notyf = new Notyf({
          position: {
               x: 'end',
               y: 'top',
          },
     });

     useEffect(() => {
          axios.get("https://i-ash-server.vercel.app/api/getall")
               .then(response => {
                    setItems(response.data);
                    console.log("Данные успешно получены");
               })
               .catch(error => {
                    console.log("Ошибка при получении данных", error);
               });
     }, []);

     const filteredItems = items.filter(item =>
          item.nomi.toLowerCase().includes(searchQuery.toLowerCase())
     );

     const updateItemQuantityOnServer = (id, newQuantity) => {
          axios.put(`https://i-ash-server.vercel.app/api/update/${id}`, { soni: newQuantity })
               .then(response => {
                    console.log("Количество успешно обновлено", response.data);
               })
               .catch(error => {
                    console.log("Ошибка при обновлении количества", error);
               });
     };

     const onPlus = (id) => {
          setItems(prevItems =>
               prevItems.map(item => {
                    if (item._id === id && item.soni > 0) {
                         const updatedCount = (selectedCounts[id] || 0) + 1;
                         if (updatedCount <= item.soni) {
                              setSelectedCounts(prevCounts => ({ ...prevCounts, [id]: updatedCount }));
                              const updatedQuantity = item.soni - 1;
                              updateItemQuantityOnServer(id, updatedQuantity);
                              return { ...item, soni: updatedQuantity };
                         }
                    }
                    return item;
               })
          );
     };

     const onMinus = (id) => {
          setItems(prevItems =>
               prevItems.map(item => {
                    if (item._id === id && selectedCounts[id] > 0) {
                         const updatedCount = (selectedCounts[id] || 0) - 1;
                         setSelectedCounts(prevCounts => ({ ...prevCounts, [id]: updatedCount }));
                         const updatedQuantity = item.soni + 1;
                         updateItemQuantityOnServer(id, updatedQuantity);
                         return { ...item, soni: updatedQuantity };
                    }
                    return item;
               })
          );
     };

     const onSeller = (item) => {
          const quantity = selectedCounts[item._id] || 0;
          if (quantity > 0) {
               const soldItem = {
                    nomi: item.nomi,
                    kelgannarxi: item.kelgannarxi,
                    sotishnarxi: item.sotishnarxi,
                    soni: quantity,
                    barcode: item.barcode,
                    saleDate: new Date().toISOString(),
               };

               axios.post("https://i-ash-server.vercel.app/api/sell", soldItem)
                    .then(response => {
                         console.log("Проданный товар успешно сохранен в базе данных", response.data);
                         notyf.success("Продукт успешно проданно")
                    })
                    .catch(error => {
                         console.log("Ошибка при сохранении проданного товара", error);
                    });

               setItems(prevItems => prevItems.filter(i => i._id !== item._id || item.soni > 0));
               setSelectedCounts(prevCounts => ({ ...prevCounts, [item._id]: 0 }));
          }
     };

     const handleOpenBarcodeModal = (item) => {
          setSelectedItem(item);
          setIsBarcodeModalOpen(true);
     };

     const handleCloseBarcodeModal = () => {
          setIsBarcodeModalOpen(false);
          setSelectedItem(null);
     };

     const indexOfLastItem = currentPage * itemsPerPage;
     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
     const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

     const handlePageChange = (event, page) => {
          setCurrentPage(page);
     };

     return (
          <div className='seller' style={{ margin: '20px', backgroundColor: '#fff', borderRadius: '8px', padding: '20px' }}>
               <TextField
                    label="Поиск продукта"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                    sx={{
                         marginBottom: 3,
                         
                         '& label.Mui-focused': {
                              color: '#2C3E50', // Change label color on focus
                         },
                         '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                   borderColor: '#2C3E50', // Default border color
                              },
                              '&:hover fieldset': {
                                   borderColor: '#2C3E50', // Border color on hover
                              },
                              '&.Mui-focused fieldset': {
                                   borderColor: '#2C3E50', // Border color when focused
                              },
                         },
                    }}
                    InputProps={{
                         startAdornment: (
                              <InputAdornment position="start">
                                   <Search style={{ color: '#2C3E50' }} />
                              </InputAdornment>
                         ),
                    }}
               />
               <TableContainer sx={{ padding: "10px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                    <Table>
                         <TableHead>
                              <TableRow>
                                   <TableCell style={{ color: '#2c3e50', fontWeight: 'bold' }}>#</TableCell>
                                   <TableCell style={{ color: '#2c3e50', fontWeight: 'bold' }}>Название продукта</TableCell>
                                   <TableCell style={{ color: '#2c3e50', fontWeight: 'bold' }}>Цена прибытия</TableCell>
                                   <TableCell style={{ color: '#2c3e50', fontWeight: 'bold' }}>Цена продажи</TableCell>
                                   <TableCell style={{ color: '#2c3e50', fontWeight: 'bold' }}>Количество</TableCell>
                                   <TableCell style={{ color: '#2c3e50', fontWeight: 'bold' }}>Штрих код</TableCell>
                                   <TableCell style={{ color: '#2c3e50', fontWeight: 'bold' }}>Действия</TableCell>
                              </TableRow>
                         </TableHead>
                         <TableBody>
                              {currentItems.map((item, index) => (
                                   <TableRow key={index} hover>
                                        <TableCell style={{ color: '#2c3e50' }}>{index + 1}</TableCell>
                                        <TableCell style={{ color: '#2c3e50' }}>{item.nomi}</TableCell>
                                        <TableCell style={{ color: '#2c3e50' }}>{item.kelgannarxi} ₽</TableCell>
                                        <TableCell style={{ color: '#2c3e50' }}>{item.sotishnarxi} ₽</TableCell>
                                        <TableCell style={{ color: '#2c3e50' }}>{item.soni}</TableCell>
                                        <TableCell>
                                             <IconButton
                                                  onClick={() => handleOpenBarcodeModal(item)}
                                                  style={{ color: '#2c3e50' }}
                                             >
                                                  <QrCode2 />
                                             </IconButton>
                                        </TableCell>
                                        <TableCell>
                                             <IconButton onClick={() => onMinus(item._id)} style={{ color: '#2c3e50' }}>
                                                  <Remove />
                                             </IconButton>
                                             <span style={{ color: '#2c3e50' }}>{selectedCounts[item._id] || 0}</span>
                                             <IconButton onClick={() => onPlus(item._id)} style={{ color: '#2c3e50' }}>
                                                  <Add />
                                             </IconButton>
                                             <IconButton onClick={() => onSeller(item)} style={{ color: '#2c3e50' }}>
                                                  <CheckCircle />
                                             </IconButton>
                                        </TableCell>
                                   </TableRow>
                              ))}
                         </TableBody>
                    </Table>
               </TableContainer>

               <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3, backgroundColor: '#ffffff', padding: '10px', borderRadius: '8px' }}>
                    <Pagination
                         count={Math.ceil(filteredItems.length / itemsPerPage)}
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
               {isBarcodeModalOpen && selectedItem && (
                    <BarcodeModal
                         onClose={handleCloseBarcodeModal}
                         product={selectedItem}
                    />
               )}

          </div>
          
     );
   
};


export default Seller;
