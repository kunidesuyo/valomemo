import React, { useEffect, useContext, useState } from 'react';

import { LoginUsernameContext } from '../LoginUsernameProvider';
import { TitleContext } from '../TitleProvider';

import { Outlet, useNavigate, Link } from 'react-router-dom';


import axios from 'axios';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button'

import Drawer from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


export default function MenuAppBar() {
  //MUI公式の例をそのまま使用


  // const [isLogin, setIsLogin] = React.useState(false);
  const [title, setTitle] = useContext(TitleContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loginUsername, setLoginUsername] = useContext(LoginUsernameContext)

  const [openDrawer, setOpenDrawer] = useState(false);


  useEffect(() => {
    setLoginUsername(localStorage.getItem("username"));
    /*const result = localStorage.getItem("isLogin");
    if(result === "true") {
      setIsLogin(true);
    } else if (result === "false") {
      setIsLogin(false);
    }*/
  },[])


  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  }

  let navigate = useNavigate();
  const handleLogout = () => {
    setAnchorEl(null);
    //cookieのtokenを削除
    axios.post('api/logout')
    .then((res) => {
      localStorage.setItem("username", "");
      setLoginUsername("");
      console.log("ログアウトしました");
      console.log(res);
      navigate('/login');
    })
    .catch((err) => {
      console.log("error");
      console.log(err);
    })
  }
  console.log(loginUsername);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            {(() => {
              if(loginUsername === "") {
                return;
              } else {
                return (
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={toggleDrawer}
                  >
                    <MenuIcon />
                  </IconButton>
                );
              }
            })()}


            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            {(() => {
              if(loginUsername === "") {
                if(title === "Login") {
                  return;
                } else {
                  return (
                    <Button
                      component={Link}
                      to="/login"
                    >
                      Login
                    </Button>
                  );
                }
              } else {
                return (
                  <div>
                    <IconButton
                      size="large"
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenu}
                      color="inherit"
                    >
                      <AccountCircle />
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleClose}>My Page</MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </div>
                )
              }
            })()}
          </Toolbar>
        </AppBar>
        <Drawer
          variant="temporary"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
            
          }}
          open={openDrawer}
          onClose={toggleDrawer}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              <ListItem key={'Read'} disablePadding>
                <ListItemButton
                  component={Link}
                  to="/read"
                  onClick={toggleDrawer}
                >
                  <HomeIcon sx={{mr: 1}}/>
                  <ListItemText primary={'Read'} />
                </ListItemButton>
              </ListItem>

              <ListItem key={'Create Setup'} disablePadding>
                <ListItemButton
                  component={Link}
                  to="/create"
                  state={{createOrUpdate: "create"}}
                  onClick={toggleDrawer}
                >
                  <AddCircleOutlineIcon sx={{mr: 1}}/>
                  <ListItemText primary={'Create Setup'} />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </Box>
      <Toolbar />
      <Outlet />
    </>
  );
}