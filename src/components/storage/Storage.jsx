import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Pagination } from '@mui/material';

const Storage = () => {
    const [soldItems, setSoldItems] = useState([]);
    const [totalProfit, setTotalProfit] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        axios.get("http://localhost:3006/api/sold-items")
            .then(response => {
                setSoldItems(response.data);
                const profit = response.data.reduce((sum, item) => {
                    const itemProfit = (item.sotishnarxi - item.kelgannarxi) * item.soni;
                    return sum + itemProfit;
                }, 0);
                setTotalProfit(profit);
            })
            .catch(error => {
                console.log("Ошибка при получении проданных товаров", error);
            });
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = soldItems.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ marginTop: -1 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Сотилган махсулотлар
                </Typography>
                <Box sx={{ marginBottom: 2, padding: 2, backgroundColor: '#e0f7fa', borderRadius: '11px' }}>
                    <Typography variant="h5">
                        Умумий соф фойда: <strong>+{Math.abs(totalProfit).toLocaleString('uz-UZ')} сум</strong>
                    </Typography>
                </Box>
                <TableContainer component={Paper} sx={{ borderRadius: '11px' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#324A5E', }}>
                                <TableCell sx={{ color: '#FFFFFF' }}>#</TableCell>
                                <TableCell sx={{ color: '#FFFFFF' }}>Махсулот номи</TableCell>
                                <TableCell sx={{ color: '#FFFFFF' }}>Келиш нархи</TableCell>
                                <TableCell sx={{ color: '#FFFFFF' }}>Сотиш нархи</TableCell>
                                <TableCell sx={{ color: '#FFFFFF' }}>Микдори</TableCell>
                                <TableCell sx={{ color: '#FFFFFF' }}>Сотув санаси</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentItems.map((item, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        backgroundColor: '#3E5871',
                                        '&:hover': {
                                            backgroundColor: '#2C3E50',
                                            '& > *': {
                                                color: '#FFFFFF',
                                            },
                                        },
                                    }}
                                >
                                    <TableCell sx={{ color: '#FFFFFF' }}>{indexOfFirstItem + index + 1}</TableCell>
                                    <TableCell sx={{ color: '#FFFFFF' }}>{item.nomi}</TableCell>
                                    <TableCell sx={{ color: '#FFFFFF' }}>{item.kelgannarxi} сум</TableCell>
                                    <TableCell sx={{ color: '#FFFFFF' }}>{item.sotishnarxi} сум</TableCell>
                                    <TableCell sx={{ color: '#FFFFFF' }}>
                                        {item.soni} {item.unit === 'kg' ? 'кг' : 'шт'}
                                    </TableCell>
                                    <TableCell sx={{ color: '#FFFFFF' }}>{new Date(item.saleDate).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Пагинация */}
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 1 }}>
                    <Pagination
                        count={Math.ceil(soldItems.length / itemsPerPage)}
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
            </Box>
        </Container>
    );
};

export default Storage;
