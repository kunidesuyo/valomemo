// createとupdate画面
import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

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
  const location = useLocation();
  //console.log(location);

  console.log(location.state.createOrUpdate);
  console.log(location.state.setup);

  const displayPage = location.state.createOrUpdate;
  //context
  const commonInfo = useContext(CommonInfoContext);

  let initData = {};
  if(displayPage === "create") {
    commonInfo.setup_list_column_name.map((key) => {
      initData[key] = "";
    });
  } else if (displayPage === "update"){
    initData = location.state.setup;
  }

  let initIsInvalidInput = {};
  commonInfo.setup_list_column_name.map((key) => {
    initIsInvalidInput[key] = false;
  })

  const [setupElements, setSetupElements] = useState(initData);
  const [isInvalidInput, setIsInvalidInput] = useState(initIsInvalidInput);
  let navigate = useNavigate();

  //デバック
  useEffect(() => {console.log(setupElements)}, [setupElements]);

  const validateInputData = () => {
    let isInvalid = false;
    let updateIsInvalidInput = {};
    commonInfo.setup_list_column_name.map((key) => {
      if(key !== "id" && setupElements[key] === "") {
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
    const isInvalid = validateInputData();
    if(isInvalid) {
      console.log("invalid input")
    } else {
      console.log("validate ok !!!")
      var params = new URLSearchParams();
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
      })
    }
  }

  const updateData = () => {
    var params = new URLSearchParams();
    Object.entries(setupElements).map(([key, value]) => {
      params.append([key], value);
    })
    /*params.append("id", id);
    params.append("content", content);*/
    console.log('send');
    axios.put('api/update', params)
    .then((res) => {
      //readにリダイレクト
      //console.log(res);
      navigate('/read');
    })
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

  const imageList = ["position_image", "aim_image", "landing_image"];

  const uploadImageForm = (props) => {
    console.log("props: " + props)
    return (
      <Box sx={{marginTop:1, marginBottom: 1}}>
        <Typography variant="h5">{props}</Typography>
        <FormControl error={isInvalidInput[props]}>
          <Button variant="contained" component="label" sx={{marginTop:1}}>
            ファイルを選択
            <input name={props} type='file' hidden accept="image/*" onChange={handleFile}/>
          </Button>
          <FormHelperText>{isInvalidInput[props] ? "選択してください" : ""}</FormHelperText>
        </FormControl>
        <img src={setupElements[props]} width="100%" sx={{marginTop:1}}/>
      </Box>
    )
  }

  const uploadImageFormList = () => {
    return (
      <>
        {imageList.map((image) => {
          return (
            uploadImageForm(image)
          )
        })}
      </>
    )
  }

  const displayImageList = () => {
    return (
      <>
        {imageList.map((image) => {
          return (
            <Box sx={{marginTop:1, marginBottom: 1}}>
              <Typography variant="h5">{image}</Typography>
              <img src={setupElements[image]} width="100%" sx={{marginTop:1}}/>
            </Box>
          )
        })}
      </>
    )
  }

  const uploadButton = () => {
    return (
      <Box sx={{marginTop:1, marginBottom: 1}}>
        <FormControl fullWidth>
          <Button variant="contained" onClick={postData}>作成</Button>
        </FormControl>
      </Box>
    )
  }

  const updateButton = () => {
    return (
      <Box sx={{marginTop:1, marginBottom: 1}}>
        <FormControl fullWidth>
          <Button variant="contained" onClick={updateData}>更新</Button>
        </FormControl>
      </Box>
    )
  }


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
        
        {/* createならアップロードフォーム、updateなら登録されている画像を表示 */}
        {/*uploadImageFormList()*/}
        {console.log(displayPage)}
        {(() => {
          if(displayPage === "create") {
            return uploadImageFormList();
          } else if (displayPage === "update"){
            return displayImageList();
          }
        })()}
    
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
        {/* ボタン切り替え */}
        {(() => {
          if(displayPage === "create") {
            return uploadButton();
          } else if (displayPage === "update"){
            return updateButton();
          }
        })()}

      </Container>
    </>
  )

}