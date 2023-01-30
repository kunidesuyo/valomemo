import * as React from 'react';

import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

//muiのテンプレートから



export default function Register() {
  axios.defaults.withCredentials = true;

  let navigate = useNavigate();
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
    axios.post('api/register', params)
    .then((res) => {
      console.log(res);
      navigate('/read');
    })
    .catch((err) => {
      console.log(err);
    })
  };

  return (
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
          Register
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
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
}