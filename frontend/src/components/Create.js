import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { db_column_name } from '../db_info';
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


export default function Create() {
  const [setupElements, setSetupElements] = useState(init_db_data);
  let navigate = useNavigate();
  //デバック
  useEffect(() => {console.log(setupElements)}, [setupElements]);

  const postData = () => {
    var params = new URLSearchParams();
    Object.entries(setupElements).map(([key, value]) => {
      if(key !== "id") {
        params.append([key], value);
      }
    })
    axios.post('api/create', params)
    .then((res) => {
      //readにリダイレクト
      console.log(res);
      navigate('/read');
    })
  }

  const handleChange = (e) => {
    //console.log(e.target);
    //console.log(e.target.value);
    setSetupElements({...setupElements, [e.target.name]: e.target.value});
    //console.log(setupElements);
  }

  const [imageUrl, setImageUrl] = useState();

  const handleFile = (e) => {
    //console.log("file")
    if(!e.target.files) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    const target_name = e.target.name;
    //reader.readAsDataURL(file);
    reader.onload = () => {
      //setImageUrl(reader.result);
      //console.log(setupElements);
      setSetupElements({...setupElements, [target_name]: reader.result});
      //console.log(setupElements);
    }
    reader.readAsDataURL(file);
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
        
        {/* mapで処理したい */}
        <Box>
          <p>position_image</p>
          <Button variant="contained" component="label">
            ファイルを選択
            <input name="position_image" type='file' hidden accept="image/*" onChange={handleFile}/>
          </Button>
          <img src={setupElements.position_image} width="100%"/>
        </Box>

        <Box>
          <p>position_image</p>
          <Button variant="contained" component="label">
            ファイルを選択
            <input name="aim_image" type='file' hidden accept="image/*" onChange={handleFile}/>
          </Button>
          <img src={setupElements.aim_image} width="100%"/>
        </Box>

        <Box>
          <p>position_image</p>
          <Button variant="contained" component="label">
            ファイルを選択
            <input name="landing_image" type='file' hidden accept="image/*" onChange={handleFile}/>
          </Button>
          <img src={setupElements.landing_image} width="100%"/>
        </Box>
        
        
        <Stack sx={{p:1}} spacing={1}>
          {/*<Box>
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
              </Box>*/}
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
              <Button variant="contained" onClick={postData}>作成</Button>
            </FormControl>
          </Box>
        </Stack>
      </Container>
    </>
  )

}