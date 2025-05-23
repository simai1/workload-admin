import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, TextField, Button, MenuItem, Select, FormControl, InputLabel, Grid, Typography } from '@mui/material';
import axios from 'axios';

const Workloads = () => {
  const [workloads, setWorkloads] = useState([]);
  const [filterInput, setFilterInput] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkloads();
  }, []);

  const fetchWorkloads = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/workloads`);
      setWorkloads(response.data);
    } catch (error) {
      console.error('Ошибка загрузки данных нагрузки:', error);
      setError('Не удалось загрузить данные учебной нагрузки');
    } finally {
      setLoading(false);
    }
  };

  const dropFilters = () => {
    setFilterInput('');
    setSelectedItem('');
  };

  const selectItems = [
    { text: 'Кафедра', value: 'department' },
    { text: 'Дисциплина', value: 'discipline' },
    { text: 'Нагрузка', value: 'workload' },
    { text: 'Группа', value: 'groups' },
    { text: 'ФИО преподавателя', value: 'educatorName' },
  ];

  const filteredItems = workloads.map(item => ({
    ...item,
    educatorName: item.educator?.name || null
  })).filter((rowItem) => {
    if (!selectedItem) return true;
    const value = rowItem[selectedItem] || '';
    return value.toString().toLowerCase().includes(filterInput.toLowerCase());
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
      field: 'uniqueId', 
      headerName: 'Уникальный ID', 
      flex: 1.5, 
      align: 'center', 
      headerAlign: 'center',
    },
    { 
      field: 'lineNumber', 
      headerName: 'Номер строки', 
      flex: 1, 
      align: 'center', 
      headerAlign: 'center',
      type: 'number'
    },
    { 
      field: 'department', 
      headerName: 'Кафедра', 
      flex: 1.5, 
      align: 'center', 
      headerAlign: 'center' 
    },
    { 
      field: 'discipline', 
      headerName: 'Дисциплина', 
      flex: 3, 
      align: 'center', 
      headerAlign: 'center' 
    },
    { 
      field: 'workload', 
      headerName: 'Нагрузка', 
      flex: 1.5, 
      align: 'center', 
      headerAlign: 'center' 
    },
    { 
      field: 'groups', 
      headerName: 'Группа', 
      flex: 2, 
      align: 'center', 
      headerAlign: 'center' 
    },
    { 
      field: 'semester', 
      headerName: 'Семестр', 
      flex: 1, 
      align: 'center', 
      headerAlign: 'center' 
    },
    { 
      field: 'period', 
      headerName: 'Период', 
      flex: 1, 
      align: 'center', 
      headerAlign: 'center' 
    },
    { 
      field: 'curriculum', 
      headerName: 'Учебный план', 
      flex: 1.5, 
      align: 'center', 
      headerAlign: 'center' 
    },
    { 
      field: 'educatorName', 
      headerName: 'ФИО преподавателя', 
      flex: 2, 
      align: 'center', 
      headerAlign: 'center' 
    },
    { 
      field: 'hours', 
      headerName: 'Часы', 
      flex: 1, 
      align: 'center', 
      headerAlign: 'center',
      type: 'number'
    },
    { 
      field: 'audienceHours', 
      headerName: 'Аудиторные часы', 
      flex: 1, 
      align: 'center', 
      headerAlign: 'center',
      type: 'number'
    },
    { 
      field: 'ratingControlHours', 
      headerName: 'Часы рейтинг-контроль', 
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

      <Card style={{ height: 700, width: '100%' }}>
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

export default Workloads;