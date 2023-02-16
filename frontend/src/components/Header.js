import React, { useEffect, useContext } from 'react';

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
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';



export default function MenuAppBar() {
  //MUI公式の例をそのまま使用


  // const [isLogin, setIsLogin] = React.useState(false);
  const [title, setTitle] = useContext(TitleContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loginUsername, setLoginUsername] = useContext(LoginUsernameContext)


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
  console.log(title);

  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
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
                    variant="contained"
                    component={Link}
                    to="/create"
                    state={{createOrUpdate: "create"}}
                    size="large"
                    sx={{mr: 1}}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
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
    </Box>
    <Outlet />
    </>
  );
}