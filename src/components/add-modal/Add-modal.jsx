import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
     Modal,
     Box,
     Typography,
     TextField,
     Button,
     IconButton,
     MenuItem,
     Select,
     InputLabel,
     FormControl
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const AddModal = ({ onClose, product, onUpdate }) => {
     const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
          defaultValues: {
               unit: 'pcs'
          }
     });
     const selectedUnit = watch('unit');

     useEffect(() => {
          if (product) {
               const fields = ['nomi', 'kelgannarxi', 'sotishnarxi', 'soni', 'barcode', 'unit'];
               fields.forEach(field => {
                    setValue(field, product[field] || (field === 'unit' ? 'pcs' : ''));
               });
          }
     }, [product, setValue]);

     const onSubmit = async (data) => {
          try {
               const url = product
                    ? `https://i-ash-server.vercel.app/api/update/${product._id}`
                    : 'https://i-ash-server.vercel.app/api/add';

               const response = await axios({
                    method: product ? 'put' : 'post',
                    url,
                    data
               });

               onClose();
               onUpdate();
               console.log(product ? 'Продукт успешно обновлен!' : 'Продукт успешно добавлен!');
          } catch (error) {
               console.error('Ошибка при сохранении данных:', error);
               console.log('Произошла ошибка!');
          }
     };

     return (
          <Modal open={true} onClose={onClose}>
               <Box sx={styles.modalContent}>
                    <IconButton sx={styles.closeButton} onClick={onClose}>
                         <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" sx={styles.title}>
                         {product ? 'Махсулотни таҳрирлаш' : 'Янги махсулот қўшиш'}
                    </Typography>
                    <Box
                         component="form"
                         onSubmit={handleSubmit(onSubmit)}
                         sx={styles.form}
                         noValidate
                    >
                         <TextField
                              label="Номи"
                              variant="outlined"
                              fullWidth
                              size="small"
                              {...register('nomi', { required: 'Номи киритиш шарт' })}
                              error={!!errors.nomi}
                              helperText={errors.nomi?.message}
                              sx={styles.textField}
                         />
                         <TextField
                              label="Келиш нархи"
                              variant="outlined"
                              fullWidth
                              type="number"
                              size="small"
                              {...register('kelgannarxi', {
                                   required: 'Келиш нархи киритиш шарт',
                                   min: { value: 0, message: 'Нарх манфий бўлиши мумкин эмас' }
                              })}
                              error={!!errors.kelgannarxi}
                              helperText={errors.kelgannarxi?.message}
                              sx={styles.textField}
                         />
                         <TextField
                              label="Сотиш нархи"
                              variant="outlined"
                              fullWidth
                              type="number"
                              size="small"
                              {...register('sotishnarxi', {
                                   required: 'Сотиш нархи киритиш шарт',
                                   min: { value: 0, message: 'Нарх манфий бўлиши мумкин эмас' }
                              })}
                              error={!!errors.sotishnarxi}
                              helperText={errors.sotishnarxi?.message}
                              sx={styles.textField}
                         />
                         <TextField
                              label={selectedUnit === 'kg' ? 'Микдори (kg)' : 'Микдори (шт)'}
                              variant="outlined"
                              fullWidth
                              type="number"
                              size="small"
                              {...register('soni', {
                                   required: 'Микдор киритиш шарт',
                                   min: { value: 0, message: 'Микдор манфий бўлиши мумкин эмас' }
                              })}
                              error={!!errors.soni}
                              helperText={errors.soni?.message}
                              sx={styles.textField}
                         />
                         <FormControl fullWidth sx={styles.select}>
                              <InputLabel id="unit-label">Ўлчов бирлиги</InputLabel>
                              <Select
                                   labelId="unit-label"
                                   label="Ўлчов бирлиги"
                                   size="small"
                                   {...register('unit', { required: true })}
                              >
                                   <MenuItem value="pcs">Шт</MenuItem>
                                   <MenuItem value="kg">Кг</MenuItem>
                              </Select>
                         </FormControl>
                         <TextField
                              label="Штрих код"
                              variant="outlined"
                              fullWidth
                              type="number"
                              size="small"
                              {...register('barcode', { required: 'Штрих код киритиш шарт' })}
                              error={!!errors.barcode}
                              helperText={errors.barcode?.message}
                              sx={styles.textField}
                         />
                         <Button
                              type="submit"
                              variant="contained"
                              size="medium"
                              sx={styles.submitButton}
                         >
                              {product ? 'Маълумотни янгилаш' : 'Маълумотни юбориш'}
                         </Button>
                    </Box>
               </Box>
          </Modal>
     );
};

const styles = {
     modalContent: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 350, // Уменьшенный фиксированный размер
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 3, // Уменьшенный padding
          borderRadius: 3,
          backgroundColor: '#E0F7FA',
     },
     closeButton: {
          position: 'absolute',
          right: 8,
          top: 8,
          color: '#004D40'
     },
     title: {
          mb: 1.5, // Уменьшенный отступ
          color: '#00796B',
          fontSize: '1.2rem' // Уменьшенный размер шрифта
     },
     form: {
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5 // Уменьшенный gap
     },
     textField: {
          '& label.Mui-focused': {
               color: '#2C3E50'
          },
          '& .MuiOutlinedInput-root': {
               '& fieldset': {
                    borderColor: '#2C3E50'
               },
               '&:hover fieldset': {
                    borderColor: '#2C3E50'
               },
               '&.Mui-focused fieldset': {
                    borderColor: '#2C3E50'
               }
          }
     },
     select: {
          '& .MuiOutlinedInput-root': {
               '& fieldset': {
                    borderColor: '#2C3E50'
               },
               '&:hover fieldset': {
                    borderColor: '#2C3E50'
               },
               '&.Mui-focused fieldset': {
                    borderColor: '#2C3E50'
               }
          }
     },
     submitButton: {
          mt: 2, // Уменьшенный отступ сверху
          backgroundColor: '#00796B',
          '&:hover': {
               backgroundColor: '#004D40'
          },
          borderRadius: 2
     }
};



export default AddModal;