import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Layout from './layouts/Layout';
import Teachers from './pages/Teachers';
import Login from './pages/Login';
import Workload from './pages/Workload';
import Students from './pages/Students';
import Sync from './pages/Sync';

function App() {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      preventDuplicate
    >
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/workloads" element={<Workload />} />
            <Route path="/students" element={<Students />} />
            <Route path="/sync" element={<Sync />} />
          </Route>
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;