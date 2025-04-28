import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  ChevronLeft,
  Logout,
  Menu,
  Person,
  Badge,
  FlipCameraAndroid
} from '@mui/icons-material';

const SideMenu = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [miniVariant, setMiniVariant] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { 
      icon: <Person />, 
      title: 'Сотрудники', 
      path: '/teachers',
      disabled: location.pathname === '/teachers'
    },
    { 
        icon: <Badge />, 
        title: 'Нагрузка', 
        path: '/workloads',
        disabled: location.pathname === '/workloads'
    },
    { 
        icon: <FlipCameraAndroid />, 
        title: 'Синхронизация', 
        path: '/sync',
        disabled: location.pathname === '/sync'
    },
  ];

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setMiniVariant(!miniVariant);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const handleLogout = () => {
    // TODO: add logout 
    console.log('Logout');
  };

  const drawerContent = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px', justifyContent: 'flex-end' }}>
        <IconButton onClick={handleDrawerToggle}>
          {miniVariant && !isMobile ? <Menu /> : <ChevronLeft />}
        </IconButton>
      </div>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.path}
            disabled={item.disabled}
            onClick={() => handleNavigation(item.path)}
            sx={{ 
              px: miniVariant && !isMobile ? 2.5 : 3,
              justifyContent: miniVariant && !isMobile ? 'center' : 'flex-start',
              '&:hover': {
                cursor: 'pointer',
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            <Tooltip title={miniVariant && !isMobile ? item.title : ''} placement="right">
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                {item.icon}
              </ListItemIcon>
            </Tooltip>
            {(!miniVariant || isMobile) && <ListItemText primary={item.title} />}
          </ListItem>
        ))}
      </List>
      <Divider />
      <ListItem 
        button 
        onClick={handleLogout}
        sx={{
            px: miniVariant && !isMobile ? 2.5 : 3,
            justifyContent: miniVariant && !isMobile ? 'center' : 'flex-start',
            '&:hover': {
            cursor: 'pointer',
            backgroundColor: theme.palette.action.hover
            }
        }}
        >
        <Tooltip title={miniVariant && !isMobile ? 'Выйти' : ''} placement="right">
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <Logout />
          </ListItemIcon>
        </Tooltip>
        {(!miniVariant || isMobile) && <ListItemText primary="Выйти" />}
      </ListItem>
    </>
  );

  return (
    <>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: isMobile ? 240 : miniVariant ? 60 : 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isMobile ? 240 : miniVariant ? 60 : 240,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default SideMenu;