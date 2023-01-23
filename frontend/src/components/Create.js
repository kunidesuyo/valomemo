import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { db_column_name } from '../db_info';
import { init_db_data, agent_names, map_names } from '../db_info';

import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import Container from '@mui/material/Container';




export default function Create() {
  const [content, setContent] = useState(init_db_data);
  let navigate = useNavigate();
  //console.log(db_column_name);

  //デバック
  useEffect(() => {console.log(content)}, [content]);

  const postData = () => {
    var params = new URLSearchParams();
    Object.entries(content).map(([key, value]) => {
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
    setContent({...content, [e.target.id]: e.target.value});
    //console.log(content);
  }

  return (
    <>
    <Container maxWidth="xs">
      <Box sx={{ maxWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="agent-select">Agent</InputLabel>
          <Select>
            {agent_names.map((agent) => {
              return (
                <MenuItem value={agent}>{agent}</MenuItem>
              )
            })}
          </Select>
        </FormControl>
      </Box>
    </Container>


    
      <h2>create</h2>
      {Object.entries(init_db_data).map(([key, value]) => {
        if(key !== "id") {
          return (
            <>
              <span>{key}</span>
              <input id={key} onChange={(e) => handleChange(e)} defaultValue={value}/>
              <br></br>
            </>
          )
        }
      })}
      <input onClick={postData} type="button" value="作成" />
    </>
  )

}