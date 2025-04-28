import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, TextField, Button, MenuItem, Select, FormControl, InputLabel, Grid, Checkbox, Typography } from '@mui/material';
import axios from 'axios';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [filterInput, setFilterInput] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/educators`);
      setTeachers(response.data);
    } catch (error) {
      console.error('Ошибка загрузки данных преподавателей:', error);
      setError('Не удалось загрузить данные преподавателей');
    } finally {
      setLoading(false);
    }
  };

  const dropFilters = () => {
    setFilterInput('');
    setSelectedItem('');
  };

  const selectItems = [
    { text: 'ФИО', value: 'name' },
    { text: 'Должность', value: 'position' },
    { text: 'Тип занятости', value: 'typeOfEmployment' },
    { text: 'Email', value: 'email' },
  ];

  const filteredItems = teachers.filter((rowItem) => {
    if (!selectedItem) return true;
    return (rowItem[selectedItem] || '').toString().toLowerCase().includes(filterInput.toLowerCase());
  });

  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      flex: 1, 
      align: 'center', 
      headerAlign: 'center',
    },
    { 
      field: 'employeeId', 
      headerName: 'ID 1C', 
      flex: 1.5, 
      align: 'center', 
      headerAlign: 'center',
    },
    { 
      field: 'name', 
      headerName: 'ФИО', 
      flex: 2, 
      align: 'center', 
      headerAlign: 'center' 
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      flex: 2, 
      align: 'center', 
      headerAlign: 'center' 
    },
    { 
      field: 'typeOfEmployment', 
      headerName: 'Тип занятости', 
      flex: 2, 
      align: 'center', 
      headerAlign: 'center' 
    },
    { 
      field: 'position', 
      headerName: 'Должность', 
      flex: 2, 
      align: 'center', 
      headerAlign: 'center' 
    },
    { 
      field: 'rate', 
      headerName: 'Ставка', 
      flex: 1, 
      align: 'center', 
      headerAlign: 'center',
      type: 'number'
    },
    { 
      field: 'maxHours', 
      headerName: 'Макс. часы', 
      flex: 1, 
      align: 'center', 
      headerAlign: 'center',
      type: 'number'
    },
    { 
      field: 'recommendedMaxHours', 
      headerName: 'Рек. часы', 
      flex: 1, 
      align: 'center', 
      headerAlign: 'center',
      type: 'number'
    },
    { 
      field: 'minHours', 
      headerName: 'Мин. часы', 
      flex: 1, 
      align: 'center', 
      headerAlign: 'center',
      type: 'number'
    },
  ];

  if (loading) return <Typography>Загрузка данных...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div className="table-wrapper" style={{ padding: 20 }}>
      <div className="wrapper__filters" style={{ marginBottom: 20 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Параметр фильтрации</InputLabel>
              <Select
                value={selectedItem}
                label="Параметр фильтрации"
                onChange={(e) => setSelectedItem(e.target.value)}
              >
                {selectItems.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {selectedItem && (
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Найти"
                value={filterInput}
                onChange={(e) => setFilterInput(e.target.value)}
              />
            </Grid>
          )}

          {selectedItem && (
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                color="secondary"
                onClick={dropFilters}
                style={{ marginTop: 8 }}
              >
                Сбросить фильтры
              </Button>
            </Grid>
          )}
        </Grid>
      </div>

      <Card style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredItems}
          columns={columns}
          getRowId={(row) => row.id}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default Teachers;