import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Card,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Typography,
} from '@mui/material';
import axios from 'axios';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filterInput, setFilterInput] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error('Ошибка загрузки данных студентов:', error);
      setError('Не удалось загрузить данные студентов');
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
    { text: 'Email', value: 'email' },
    { text: 'Группа', value: 'group' },
    { text: 'Специализация', value: 'specialization' },
    { text: 'Курс', value: 'course' },
    { text: 'Основа', value: 'basis' },
  ];

  const filteredItems = students.filter((rowItem) => {
    if (!selectedItem) return true;
    return (rowItem[selectedItem] || '')
      .toString()
      .toLowerCase()
      .includes(filterInput.toLowerCase());
  });

  const columns = [
    { field: 'id', headerName: 'ID', flex: 2 },
    { field: 'name', headerName: 'ФИО', flex: 2 },
    { field: 'email', headerName: 'Email', flex: 2 },
    { field: 'group', headerName: 'Группа', flex: 1.5 },
    { field: 'course', headerName: 'Курс', flex: 1 },
    { field: 'department', headerName: 'Подразделение', flex: 2 },
    { field: 'educationForm', headerName: 'Форма обучения', flex: 1.5 },
    { field: 'basis', headerName: 'Основа', flex: 1.5 },
    {
      field: 'specialization',
      headerName: 'Специализация',
      flex: 2.5,
    },
    {
      field: 'formOfOrder',
      headerName: 'Форма приказа',
      flex: 2,
    },
    {
      field: 'hasIndividualPlan',
      headerName: 'Инд. план',
      flex: 1,
      type: 'boolean',
    },
    {
      field: 'conditionalTransfer',
      headerName: 'Условный перевод',
      flex: 1.5,
      type: 'boolean',
    },
  ];

  if (loading) return <Typography>Загрузка данных...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div className="table-wrapper" style={{ padding: 20 }}>
      <div className="wrapper__filters" style={{ marginBottom: 20 }}>
        <Grid container spacing={2}>
          <Grid item sx={{ width: '400px' }}>
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

      <Card style={{ height: 800, width: '100%' }}>
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

export default Students;
