import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Delete from './Delete'

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
      <Container maxWidth="md">
        <Button
          variant="contained"
          component={Link}
          to="/create"
        >
          新規作成
        </Button>
        {setups.map((setup) => {
          return (
            <Box key={setups.id} border={1} sx={{m:3}}>
              <Grid container sx={{p:1}} spacing={1}>
                <Grid item xs={4}>
                  <TextField 
                    InputProps={{readOnly: true}}
                    value={setup.map}
                    label="map"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField 
                    InputProps={{readOnly: true}}
                    value={setup.agent}
                    label="agent"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField 
                    InputProps={{readOnly: true}}
                    value={setup.ability}
                    label="ability"
                  />
                </Grid>
              </Grid>

              <Stack sx={{p:1}} spacing={1}>
                <p>position_image</p>
                <img src={setup.position_image} width="100%"/>
                <p>aim_image</p>
                <img src={setup.aim_image} width="100%"/>
                <p>landing_image</p>
                <img src={setup.landing_image} width="100%"/>
                <TextField
                  InputProps={{readOnly: true}}
                  value={setup.description}
                  label="description"
                />
              </Stack>

              {/*<Grid container sx={{p:1}} spacing={1}>
                <Grid item xs={6}>
                  <Button variant="contained">編集</Button>
                </Grid>
                <Grid item xs={6}>
                  <Button variant="contained">削除</Button>
                </Grid>
              </Grid>*/}

              <Button
                variant="contained"
                component={Link}
                to="/update"
                state={setup}
              >
                編集
              </Button>
              <Delete id={setup.id} detectDelete={detectDelete} setDetectDelete={setDetectDelete} />
            </Box>
          )
        })}
      </Container>
    </>
  )
}