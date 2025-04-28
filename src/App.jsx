import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Layout from './layouts/Layout';
import Teachers from './pages/Teachers';
import Login from './pages/Login';
import Workload from './pages/Workload';
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
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Login />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/workloads" element={<Workload />} />
            <Route path="/sync" element={<Sync />} />
            <Route index element={<Login />} />
          </Route>
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;