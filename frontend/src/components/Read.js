import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Delete from './Delete';
import SetupCard from './SetupCard';

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
  
  useEffect(() => {
    //console.log('detect delete')
    axios.get('/api/read')
    .then((res) => {
      console.log(res.data);
      setSetups(res.data);
    })
  }, [detectDelete]);

  return (
    <>
      <Container maxWidth="lg">
        <Typography variant="h2">Read</Typography>
        <Button
          variant="contained"
          component={Link}
          to="/create"
          state={{createOrUpdate: "create"}}
        >
          新規作成
        </Button>
        {setups.map((setup) => {
          return (
            <SetupCard setup={setup} detectDelete={detectDelete} setDetectDelete={setDetectDelete}/>            
          )
        })}
      </Container>
    </>
  )
}