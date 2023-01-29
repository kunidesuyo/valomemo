import React, { useEffect, useState, useContext, useRef } from 'react';
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
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormHelperText from '@mui/material/FormHelperText';


import { CommonInfoContext } from '../CommonInfoProvider';


export default function Create() {
  //context
  const commonInfo = useContext(CommonInfoContext);
  //console.log(commonInfo);

  let initData = {};
  commonInfo.setup_list_column_name.map((key) => {
    //console.log(key);
    initData[key] = "";
  });
  //console.log(initData);
  let initIsInvalidInput = {};
  commonInfo.setup_list_column_name.map((key) => {
    initIsInvalidInput[key] = false;
  })

  /*let test = {};
  commonInfo.setup_list_column_name.map((key) => {
    test[key] = false;
  })
  console.log(test);

  const k = "ability";

  test = {...test, [k]: true};
  console.log(test);*/
  
  const [setupElements, setSetupElements] = useState(initData);
  const [isInvalidInput, setIsInvalidInput] = useState(initIsInvalidInput);
  let navigate = useNavigate();

  //デバック
  useEffect(() => {console.log(setupElements)}, [setupElements]);

  const validateInputData = () => {
    let isInvalid = false;
    let updateIsInvalidInput = {};
    commonInfo.setup_list_column_name.map((key) => {
      if(setupElements[key] === "") {
        updateIsInvalidInput[key] = true;
        isInvalid = true;
      } else {
        updateIsInvalidInput[key] = false;
      }
    })
    setIsInvalidInput(updateIsInvalidInput);
    return isInvalid;
  }

  const postData = () => {
    //??? stateを更新したあとstateを参照しても更新前のまま
    //console.log("validate")
    const isInvalid = validateInputData();
    //console.log(isInvalidInput)
    if(isInvalid) {
      //setIsInvalidInput(true);
      console.log("invalid input")
    } else {
      //setIsInvalidInput(false);
      console.log("validate ok !!!")
      /*var params = new URLSearchParams();
      Object.entries(setupElements).map(([key, value]) => {
        if(key !== "id") {
          params.append([key], value);
        }
      })
      console.log("send data")
      axios.post('api/create', params)
      .then((res) => {
        //readにリダイレクト
        console.log(res);
        navigate('/read');
      })
      .catch((err) => {
        console.log(err);
      })*/
    }
  }

  const handleChange = (e) => {
    setSetupElements({...setupElements, [e.target.name]: e.target.value});
  }


  const handleFile = (e) => {
    if(!e.target.files) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    const target_name = e.target.name;
    reader.onload = () => {
      setSetupElements({...setupElements, [target_name]: reader.result});
    }
    reader.readAsDataURL(file);
  }

  let imageUrls = {};

  commonInfo.agent_names.map((agent_name) => {
    imageUrls[agent_name] = process.env.PUBLIC_URL + "/images/agents/" + agent_name +".webp";
  })


  
  return (
    <>
      <Container maxWidth="md">
        <Typography variant="h3">Create New Setup</Typography>
        <Box sx={{marginTop:1, marginBottom: 1}}>
          <Typography variant="h5">Title</Typography>
          <FormControl fullWidth sx={{marginTop: 1}}>
            <TextField 
              name="title"
              onChange={(e) => handleChange(e)}
              value={setupElements.title}
              error={isInvalidInput.title}
              helperText={isInvalidInput.title ? "タイトルを入力してください" : ""}
            />
          </FormControl>
        </Box>
        <Box sx={{marginTop:1, marginBottom: 1}}>
          <Typography variant="h5">Map</Typography>
          <FormControl sx={{minWidth: 120, marginTop:1}} error={isInvalidInput.map}>
            <Select
              labelId="map-select"
              name="map"
              onChange={(e) => handleChange(e)}
              value={setupElements.map}
            >
              {commonInfo.map_names.map((map) => {
                return (
                  <MenuItem key={map} value={map}>{map}</MenuItem>
                )
              })}
            </Select>
            <FormHelperText>{isInvalidInput.map ? "選択してください" : ""}</FormHelperText>
          </FormControl>
        </Box>
        
        <Box sx={{marginTop:1, marginBottom: 1}}>
          <Typography variant="h5">Agent</Typography>
          <FormControl sx={{height: 1}} error={isInvalidInput.agent}>
            <RadioGroup
              name="agent"
              value={setupElements.agent}
              onChange={(e) => handleChange(e)}
              sx={{height: 1}}
            >
              <ImageList
                variant='woven'
                cols={10}
                gap={1}
              >
                {commonInfo.agent_names.map((agent_name) => (    
                  <Radio
                    key={agent_name}
                    value={agent_name}
                    icon={
                      <ImageListItem>
                        <img
                          src={`${imageUrls[agent_name]}?w=164&h=164&fit=crop&auto=format`}
                          srcSet={`${imageUrls[agent_name]}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                          loading='lazy'
                        />
                      </ImageListItem>
                    }
                    checkedIcon={
                      <ImageListItem sx={{border: 4}}>
                        <img
                          src={`${imageUrls[agent_name]}?w=164&h=164&fit=crop&auto=format`}
                          srcSet={`${imageUrls[agent_name]}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                          loading='lazy'
                        />
                      </ImageListItem>
                    }
                  />
                ))}
              </ImageList>
            </RadioGroup>
            <FormHelperText>{isInvalidInput.agent ? "選択してください" : ""}</FormHelperText>
          </FormControl>
        </Box>
                    
        <Box sx={{marginTop:1, marginBottom: 1}}>
          <Typography variant="h5">Ability</Typography>
          <FormControl sx={{minWidth: 120, marginTop:1}} error={isInvalidInput.ability}>
            <Select
              name="ability"
              onChange={(e) => handleChange(e)}
              value={setupElements.ability}
            >
              {commonInfo.abilitys.map((ability) => {
                return (
                  <MenuItem key={ability} value={ability}>{ability}</MenuItem>
                )
              })}
            </Select>
            <FormHelperText>{isInvalidInput.ability ? "選択してください" : ""}</FormHelperText>
          </FormControl>
        </Box>
        
        {/*mapで実装したい */}
        <Box sx={{marginTop:1, marginBottom: 1}}>
          <Typography variant="h5">position_image</Typography>
          <FormControl error={isInvalidInput.position_image}>
            <Button variant="contained" component="label" sx={{marginTop:1}}>
              ファイルを選択
              <input name="position_image" type='file' hidden accept="image/*" onChange={handleFile}/>
            </Button>
            <img src={setupElements.position_image} width="100%" sx={{marginTop:1}}/>
            <FormHelperText>{isInvalidInput.position_image ? "選択してください" : ""}</FormHelperText>
          </FormControl>
          
        </Box>

        <Box sx={{marginTop:1, marginBottom: 1}}>
          <Typography variant="h5">aim_image</Typography>
          <FormControl error={isInvalidInput.aim_image}>
            <Button variant="contained" component="label" sx={{marginTop:1}}>
              ファイルを選択
              <input name="aim_image" type='file' hidden accept="image/*" onChange={handleFile}/>
            </Button>
            <img src={setupElements.aim_image} width="100%"/>
            <FormHelperText>{isInvalidInput.aim_image ? "選択してください" : ""}</FormHelperText>
          </FormControl>

        </Box>

        <Box sx={{marginTop:1, marginBottom: 1}}>
          <Typography variant="h5">landing_image</Typography>
          <FormControl error={isInvalidInput.landing_image}>
            <Button variant="contained" component="label" sx={{marginTop:1}}>
              ファイルを選択
              <input name="landing_image" type='file' hidden accept="image/*" onChange={handleFile}/>
            </Button>
            <img src={setupElements.landing_image} width="100%"/>
            <FormHelperText>{isInvalidInput.landing_image ? "選択してください" : ""}</FormHelperText>
          </FormControl>
          
        </Box>
    
        <Box sx={{marginTop:1, marginBottom: 1}}>
          <Typography variant="h5">Description</Typography>
          <FormControl fullWidth>
            <TextField 
              name="description"
              multiline
              rows={5}
              onChange={(e) => handleChange(e)}
              value={setupElements.description}
              error={isInvalidInput.description}
              helperText={isInvalidInput.description ? "説明を入力してください" : ""}
            />
          </FormControl>
        </Box>
        <Box sx={{marginTop:1, marginBottom: 1}}>
          <FormControl fullWidth>
            <Button variant="contained" onClick={postData}>作成</Button>
          </FormControl>
        </Box>
      </Container>
    </>
  )

}