import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

import { init_db_data, agent_names, map_names, skills } from '../db_info';

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

/* create画面とほとんど同じなのでまとめたい */

export default function Update() {
  const location = useLocation();
  console.log(location.state);
  const [setupElements, setSetupElements] = useState(location.state);
  const id = location.state.id;
  let navigate = useNavigate();
  //デバッグ
  useEffect(() => {console.log(setupElements)}, [setupElements]);

  const postData = () => {
    var params = new URLSearchParams();
    Object.entries(setupElements).map(([key, value]) => {
      params.append([key], value);
    })
    /*params.append("id", id);
    params.append("content", content);*/
    console.log('send');
    axios.post('api/update', params)
    .then((res) => {
      //readにリダイレクト
      //console.log(res);
      navigate('/read');
    })
  }

  const handleChange = (e) => {
    //console.log(e.target.value);
    //console.log(e.target.id);
    setSetupElements({...setupElements, [e.target.name]: e.target.value})
    console.log(setupElements);
  }

  return (
    <>
      <Container maxWidth="xs">
        <Grid container sx={{p:1}} spacing={1}>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="map-select">Map</InputLabel>
              <Select
                labelId="map-select"
                label="Map"
                name="map"
                onChange={(e) => handleChange(e)}
                defaultValue={setupElements.map}
                value={setupElements.map}
              >
                {map_names.map((map) => {
                  return (
                    <MenuItem value={map}>{map}</MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="agent-select">Agent</InputLabel>
              <Select
                label="Agent"
                name="agent"
                onChange={(e) => handleChange(e)}
                defaultValue={setupElements.agent}
                value={setupElements.agent}
              >
                {agent_names.map((agent) => {
                  return (
                    <MenuItem value={agent}>{agent}</MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="skill-select">Skill</InputLabel>
              <Select
                label="Skill"
                name="skill"
                onChange={(e) => handleChange(e)}
                value={setupElements.skill}
              >
                {skills.map((skill) => {
                  return (
                    <MenuItem value={skill}>{skill}</MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Stack sx={{p:1}} spacing={1}>
          <Box>
            <FormControl fullWidth>
              <TextField 
                label="position_image"
                name="position_image"
                onChange={(e) => handleChange(e)}
                value={setupElements.position_image}
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl fullWidth>
              <TextField 
                label="aim_image"
                name="aim_image"
                onChange={(e) => handleChange(e)}
                value={setupElements.aim_image}
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl fullWidth>
              <TextField 
                label="landing_image"
                name="landing_image"
                onChange={(e) => handleChange(e)}
                value={setupElements.landing_image}
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl fullWidth>
              <TextField 
                label="content"
                name="content"
                onChange={(e) => handleChange(e)}
                value={setupElements.content}
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl fullWidth>
              <Button variant="contained" onClick={postData}>更新</Button>
            </FormControl>
          </Box>
        </Stack>
      </Container>
      <h2>update</h2>
      <form>
        <span>{id} </span>
        {Object.entries(setupElements).map(([key, value]) => {
          if(key==="id") return '';
          return (
            <input key={key} id={key} onChange={(e) => {handleChange(e)}} defaultValue={value}/>
          )
        })}
        <input onClick={postData} type="button" value="更新" />
      </form>
    </>
  )

}