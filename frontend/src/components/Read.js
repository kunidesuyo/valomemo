import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Delete from './Delete';
import SetupCard from './SetupCard';

import { TitleContext } from '../TitleProvider';
import { LoginUsernameContext } from '../LoginUsernameProvider';
import { db_column_name, init_db_data, agent_names, map_names, skills } from '../db_info';

import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography';

axios.defaults.withCredentials = true;

export default function Read() {
  const [setups, setSetups] = useState([]);
  const [detectDelete, setDetectDelete] = useState([0]);
  const [title, setTitle] = useContext(TitleContext);
  const [loginUsername, setLoginUsername] = useContext(LoginUsernameContext)

  
  let navigate = useNavigate();
  useEffect(() => {
    //console.log("login username: " + loginUsername);
    setTitle("Read");

    //ページリロードをするとstateが消えるのでlocalStorageから持ってくる
    setLoginUsername(localStorage.getItem("username"));
    
    if(localStorage.getItem("username") === "") {
      console.log("ログインしていません");
      navigate('/login');
    } else {
      console.log("ログインしています " + loginUsername);
      axios.get('/api/read')
      .then((res) => {
        console.log(res.data);
        setSetups(res.data);
      })
      .catch((error) => {
        console.log(error);
        navigate('/login');
      })
    }

    
  }, [detectDelete]);

  return (
    <>
      <Container maxWidth="lg" sx={{mt: 5, mb: 5}}>
        <Grid
          container
          alignItems="center"
          justify="center"
          spacing={{ xs: 2, md: 3 }}
        >
          {setups.map((setup) => {
            return (
              <Grid
                item
                xs={12} sm={6} md={4} lg={3} xl={2}
                key={setup.id}
              >
                <SetupCard
                  setup={setup}
                  detectDelete={detectDelete}
                  setDetectDelete={setDetectDelete}
                />
              </Grid>   
            )
          })}
        </Grid>
      </Container>
    </>
  )
}