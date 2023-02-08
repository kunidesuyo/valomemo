import React, { useContext, useEffect, useState } from 'react';

import { LoginUsernameContext } from '../LoginUsernameProvider';
import { TitleContext } from '../TitleProvider';

import { useNavigate } from 'react-router-dom';


import axios from 'axios';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Collapse from '@mui/material/Collapse';



//muiのテンプレートから


export default function Login() {
  const [loginUsername, setLoginUsername] = useContext(LoginUsernameContext)
  const [title, setTitle] = useContext(TitleContext);
  const [openAlert, setOpenAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  axios.defaults.withCredentials = true;
  let navigate = useNavigate();

  useEffect(() => {
    setTitle("Login");
    //const result = localStorage.getItem("isLogin");
    console.log("localStorage: " + localStorage.getItem("username"));
    if(loginUsername) {
      //ログイン済みなのでreadに遷移
      //setIsLogin(true);
      navigate('/read');
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    /*console.log({
      username: data.get('username'),
      password: data.get('password'),
    });*/
    const username = data.get('username');
    const password = data.get('password');
    if(username === "" || password === "") {
      return;
    }
    //console.log("continue")
    var params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);
    axios.post('api/login', params)
    .then((res) => {
      console.log(res.data[0].username);
      //ローカルストレージにログイン状態を保存
      localStorage.setItem("username", res.data[0].username);
      //setIsLogin(true);

      //resに入っているusernameを入れる
      setLoginUsername(res.data[0].username);
      navigate('/read');
    })
    .catch((err) => {
      console.log(err.response.data[0].message);
      setErrorMessage(err.response.data[0].message);
      setOpenAlert(true);
    })
  };

  const goRegister = () => {
    navigate('/register');
  }

  return (
    <>
    <Collapse in={openAlert}>
    <Alert severity="error" sx={{mt: 2, ml: 1, mr: 1}}>
      <AlertTitle>Error</AlertTitle>
      {errorMessage}
    </Alert>
    </Collapse>
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            id="uername"
            label="Username"
            name="username"
            autoFocus
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
        <Button onClick={goRegister}>register</Button>
      </Box>
    </Container>
    </>
  );
}