import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';




export default function Home() {
  let navigate = useNavigate();

  const goLogin = () => {
    navigate('/login');
  }

  const goRegister = () => {
    navigate('/register');
  }

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
        <Typography variant="h3">Welcom to valomemo</Typography>
        <Grid container>
          <Grid item xs={4}></Grid>
          <Grid item xs={2}>
            <Box sx={{textAlign: "center", maxWidth: "100%"}}>
              <Button onClick={goLogin} sx={{mt: 5, mb: 5}}>login</Button>
            </Box>
          </Grid>
          <Grid item xs={2}>
            <Box sx={{textAlign: "center", maxWidth: "100%"}}>
              <Button onClick={goRegister} sx={{mt: 5, mb: 5}}>register</Button>
            </Box>
          </Grid>
          <Grid item xs={4}></Grid>
        </Grid>
      </Box>
    </Container>
  )
}