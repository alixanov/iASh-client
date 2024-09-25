import React, { useEffect, useRef, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  TextField,
  Grid,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
  Pagination
} from '@mui/material';
import {
  AccountCircle,
  Delete,
  CreditCard,
  Search,
  Receipt,
  Backspace,
  // Payment,
  MonetizationOn,
} from '@mui/icons-material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from 'axios';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import { useReactToPrint } from 'react-to-print';




const Salesman = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [barcode, setBarcode] = useState('');
  const [products, setProducts] = useState([]);
  const [transaction, setTransaction] = useState([]);
  const [total, setTotal] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(null); // Добавляем состояние для выбора метода оплаты


  useEffect(() => {
    axios
      .get('https://i-ash-server.vercel.app/api/getall')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log('Ошибка при получении данных', error);
        setSnackbar({ open: true, message: 'Ошибка при получении данных', severity: 'error' });
      });
  }, []);

  useEffect(() => {
    const newTotal = transaction.reduce((sum, item) => sum + item.sotishnarxi * item.quantity, 0);
    setTotal(newTotal);
  }, [transaction]);

  const handleSearch = () => {
    const foundProduct = products.find((p) => p.barcode === Number(barcode.split('*')[0]));
    if (foundProduct) {
      const quantity = parseInt(barcode.split('*')[1], 10) || 1;
      const existingProduct = transaction.find((item) => item._id === foundProduct._id);
      if (existingProduct) {
        setTransaction(
          transaction.map((item) =>
            item._id === foundProduct._id ? { ...item, quantity: item.quantity + quantity } : item
          )
        );
      } else {
        setTransaction([...transaction, { ...foundProduct, quantity, date: new Date().toLocaleString() }]);
      }
      setSnackbar({ open: true, message: 'Махсулот руйтагга қушилди', severity: 'success' });
    } else {
      setSnackbar({ open: true, message: 'Продукт не найден', severity: 'warning' });
    }
    setBarcode('');
  };

  const handleFinalizeSale = () => {
    if (transaction.length === 0) {
      setSnackbar({ open: true, message: 'Руйхат буш', severity: 'warning' });
      return;
    }

    transaction.forEach(item => {
      const soldItem = {
        nomi: item.nomi,
        kelgannarxi: item.kelgannarxi,
        sotishnarxi: parseInt(item.sotishnarxi, 10),
        soni: item.quantity,
        barcode: item.barcode,
        saleDate: new Date().toISOString(),
        paymentMethod, // Добавляем метод оплаты к каждому проданному товару,
        unit: item.unit // Добавляем единицу измерения (килограммы или штуки)
      };

      axios.post("http://localhost:3006/api/sell", soldItem)
        .then(response => {
          console.log("Проданный товар успешно сохранен в базе данных", response.data);
          setSnackbar({ open: true, message: 'Продукт успешно продан', severity: 'success' });
        })
        .catch(error => {
          console.log("Ошибка при сохранении проданного товара", error);
          setSnackbar({ open: true, message: 'Ошибка при сохранении проданного товара', severity: 'error' });
        });
    });

    setTransaction([]); // Очистка чека после завершения продажи
    setPaymentMethod(null); // Сброс метода оплаты после завершения продажи

    handlePrint()
  };

  const handleRemoveItem = (id) => {
    setTransaction(transaction.filter((item) => item._id !== id));
    setSnackbar({ open: true, message: 'Махсулот руйхатдан учирилди', severity: 'info' });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleBackspace = () => {
    setBarcode(barcode.slice(0, -1));
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const paginatedTransaction = transaction.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000); // Обновляем каждую секунду

    // Чистим интервал при размонтировании компонента
    return () => clearInterval(intervalId);
  }, []);

  return (
    
    <Box sx={{ padding: '12px', backgroundColor: '#2C3E50', minHeight: '100vh' }}>
      <AppBar
        position="static"
        sx={{
          marginBottom: '12px',
          background: 'linear-gradient(to right, #34495E, #2C3E50)',
          opacity: 0.95,
        }}
      >
        <Toolbar>
          {/* Логотип кассового аппарата */}
          <LocalMallIcon sx={{ marginRight: '12px', color: '#ECF0F1' }} />

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ASh 
          </Typography>

          {/* Часы реального времени */}
          <Typography variant="body1" sx={{ marginRight: '24px' }}>
            {time}
          </Typography>

          {/* Иконка пользователя с выпадающим меню */}
          {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ marginRight: '6px' }}>
              Xxxxx Xxxxxxxxx
            </Typography>
            <IconButton>
              <AccountCircle sx={{ color: '#ECF0F1' }} />
            </IconButton>
          </Box> */}
        </Toolbar>
      </AppBar>

      <Grid container spacing={1}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ padding: '12px', backgroundColor: '#34495E', color: '#ECF0F1' }}>
            <TextField
              label="Barcode рақамни киритинг"
              variant="outlined"
              fullWidth
              value={barcode}
              onChange={(e) => {
                const input = e.target.value;
                // Проверяем ввод только цифр и символа '*'
                if (/^[\d*]*$/.test(input)) {
                  setBarcode(input);
                } else {
                  setSnackbar({
                    open: true,
                    message: 'Факат рақамлар ва * ушбу белги',
                    severity: 'warning',
                  });
                }
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearch}>
                    <Search sx={{ color: '#ECF0F1' }} />
                  </IconButton>
                ),
              }}
              sx={{ marginBottom: '12px', input: { color: '#ECF0F1' }, label: { color: '#ECF0F1' } }}
            />

            <Grid container spacing={0.5} sx={{ marginBottom: '12px' }}>
              <Grid item xs={12}>
                <Grid container spacing={0.5}>
                  {['7', '8', '9'].map((label) => (
                    <Grid item xs={4} key={label}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => setBarcode(barcode + label)}
                        sx={{ minHeight: '36px', fontSize: '14px', color: '#ECF0F1', borderColor: '#ECF0F1' }}
                      >
                        {label}
                      </Button>
                    </Grid>
                  ))}
                  {['4', '5', '6'].map((label) => (
                    <Grid item xs={4} key={label}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => setBarcode(barcode + label)}
                        sx={{ minHeight: '36px', fontSize: '14px', color: '#ECF0F1', borderColor: '#ECF0F1' }}
                      >
                        {label}
                      </Button>
                    </Grid>
                  ))}
                  {['1', '2', '3'].map((label) => (
                    <Grid item xs={4} key={label}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => setBarcode(barcode + label)}
                        sx={{ minHeight: '36px', fontSize: '14px', color: '#ECF0F1', borderColor: '#ECF0F1' }}
                      >
                        {label}
                      </Button>
                    </Grid>
                  ))}
                  {['0', '*', 'Backspace', 'Enter'].map((label) => (
                    <Grid item xs={3} key={label}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={
                          label === '*' ? <AddCircleOutlineIcon /> :
                            label === 'Backspace' ? <Backspace /> :
                              label === 'Enter' ? <Receipt /> :
                                null
                        }
                        onClick={() => {
                          if (label === 'Backspace') {
                            handleBackspace();
                          } else if (label === 'Enter') {
                            handleSearch();
                          } else {
                            setBarcode(barcode + label);
                          }
                        }}
                        sx={{ minHeight: '36px', fontSize: '14px', color: '#ECF0F1', borderColor: '#ECF0F1' }}
                      >
                        {label === 'Backspace' ? 'Учириш' : label === 'Enter' ? 'қидириш' : label}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>

            <List sx={{ maxHeight: '400px', overflowY: 'auto', backgroundColor: '#34495E' }}>
              {paginatedTransaction.map((item) => (
                <React.Fragment key={item._id}>
                  <ListItem>
                    <ListItemText
                      primary={`${item.nomi} - ${item.quantity} x ${item.sotishnarxi} сум`}
                      secondary={`Вақти: ${item.date}`}
                      sx={{ color: '#ECF0F1' }}
                    />
                    <IconButton onClick={() => handleRemoveItem(item._id)} sx={{ color: '#E74C3C' }}>
                      <Delete />
                    </IconButton>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
            <Pagination
              count={Math.ceil(transaction.length / itemsPerPage)}
              page={page}
              onChange={handleChangePage}
              sx={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{ padding: '12px', backgroundColor: '#2c3e50', color: '#ECF0F1', border: "solid 1px white" }}>
            <Typography variant="h6" sx={{ marginBottom: '12px' }}>
              Чек
            </Typography>
            <TableContainer component={Paper}
              ref={componentRef} 
            >
              <Table sx={{ minWidth: 150, backgroundColor: '#2c3e50',border:'solid 1px white' }} aria-label="cheque table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#ECF0F1' }}>Номи</TableCell>
                    <TableCell sx={{ color: '#ECF0F1' }} align="right">Нарх</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transaction.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell component="th" scope="row" sx={{ color: '#ECF0F1' }}>
                        {item.nomi}
                      </TableCell>
                      <TableCell align="right" sx={{ color: '#ECF0F1' }}>
                        {item.sotishnarxi} сум
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell sx={{ color: '#ECF0F1' }}>Умумий:</TableCell>
                    <TableCell align="right" sx={{ color: '#ECF0F1' }}>{total} сум</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#ECF0F1' }}>Тулов тури:</TableCell>
                    <TableCell align="right" sx={{ color: '#ECF0F1' }}>{paymentMethod || 'Танланг'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
              <Button
                variant="contained"
                onClick={() => setPaymentMethod('Карта')}
                startIcon={<CreditCard />}
                sx={{ marginRight: '6px', backgroundColor: '#2980B9', color: '#ECF0F1' }}
              >
             Картадан тулаш
              </Button>
              <Button
                variant="contained"
                onClick={() => setPaymentMethod('Нақд')}
                startIcon={<MonetizationOn />}
                sx={{
                  backgroundColor: '#27AE60',
                  color: '#ECF0F1',
                  '&:hover': {
                    backgroundColor: '#057835', // более грубый зеленый цвет
                  },
                }}
              >
               Нақд пулда тулаш
              </Button>

            </Box>
        


         
               
                  <Button
                    variant="contained"
                    onClick={handleFinalizeSale}
              startIcon={<LocalGroceryStoreIcon />}
                    sx={{ marginTop: '12px', backgroundColor: '#E74C3C', color: '#ECF0F1' }}
                    disabled={!paymentMethod} // Кнопка отключена, если метод оплаты не выбран
                  >
                    Сотувни якунлаш
                  </Button>
              
           


          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};


export default Salesman;


