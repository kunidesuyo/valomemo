// createとupdate画面
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

import { TitleContext } from '../TitleProvider';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormHelperText from '@mui/material/FormHelperText';
import LoadingButton from '@mui/lab/LoadingButton';



import { CommonInfoContext } from '../CommonInfoProvider';
import { LoginUsernameContext } from '../LoginUsernameProvider';


export default function CreateUpdate() {
  const location = useLocation();
  const displayPage = location.state.createOrUpdate;
  //context
  const commonInfo = useContext(CommonInfoContext);

  let initData = {};
  let initAbilityIcons = ["", "", "", ""];
  const initAbilityIconUrl = process.env.PUBLIC_URL + "/images/abilitys/RP.webp";
  /* ↓ useEffectの中に入れる？ */
  if(displayPage === "create") {
    commonInfo.setup_list_column_name.map((key) => {
      initData[key] = "";
    });
    
    for(let i = 0; i < 4; i++) {
      initAbilityIcons[i] = initAbilityIconUrl;
    }
  } else if (displayPage === "update"){
    initData = location.state.setup;
    for(let i = 0; i < 4; i++) {
      initAbilityIcons[i] = process.env.PUBLIC_URL + "/images/abilitys/" + location.state.setup.agent + "Ability" + (i+1) + ".webp";
    }
  }
  

  let initIsInvalidInput = {};
  commonInfo.setup_list_column_name.map((key) => {
    initIsInvalidInput[key] = false;
  })
  /* ↑ useEffectの中に入れる？ */


  const [setupElements, setSetupElements] = useState(initData);
  const [isInvalidInput, setIsInvalidInput] = useState(initIsInvalidInput);
  const [abilityIcons, setAbilityIcons] = useState(initAbilityIcons);
  const [title, setTitle] = useContext(TitleContext);
  const [loading, setLoading] = useState(false);
  const [loginUsername, setLoginUsername] = useContext(LoginUsernameContext)




  //デバック
  //useEffect(() => {console.log(setupElements)}, [setupElements]);

  let navigate = useNavigate();
  useEffect(() => {
    console.log("ログイン状態確認");
    //const isLogin = localStorage.getItem("isLogin");
    setLoginUsername(localStorage.getItem("username"));
    if(localStorage.getItem("username") === "") {
      console.log("ログインしていません");
      navigate('/login');
    }
    console.log("ログインしています");
    //updateで編集するsetupのcreated_byとログインしているユーザーが違ったら弾く
    if(displayPage === "update") {
      console.log("setup created by: " + setupElements.created_by);
      console.log("login username: " + localStorage.getItem("username"));
      if(setupElements.created_by !== localStorage.getItem("username")) {
        console.log("作成したユーザーではないため編集できません");
        navigate('/read');
      }
    }
    //title設定
    if(displayPage === "create") {
      setTitle("Create");
    } else if(displayPage === "update"){
      setTitle("Update");
    }
  },[]);

  const validateInputData = () => {
    let isInvalid = false;
    let updateIsInvalidInput = {};
    commonInfo.setup_list_column_name.map((key) => {
      if((key !== "id" && key !== "created_by") && setupElements[key] === "") {
        updateIsInvalidInput[key] = true;
        isInvalid = true;
      } else {
        updateIsInvalidInput[key] = false;
      }
    })
    setIsInvalidInput(updateIsInvalidInput);
    return isInvalid;
  }

  //処理がほぼ一緒なのでupdateDataとまとめる
  const postData = () => {
    //??? stateを更新したあとstateを参照しても更新前のまま
    const isInvalid = validateInputData();
    if(isInvalid) {
      console.log("invalid input");
    } else {
      console.log("validate ok !!!");
      setLoading(true);
      var params = new URLSearchParams();
      Object.entries(setupElements).map(([key, value]) => {
        if(key !== "id" || key !== "created_by") {
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
        //エラーアラート表示
        //リダイレクト
        navigate('/login');
      })
    }
  }

  const updateData = () => {
    const isInvalid = validateInputData();
    if(isInvalid) {
      console.log("invalid input");
    } else {
      console.log("validate ok !!!");
      setLoading(true);
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
      .catch((error) => {
        console.log(error);
        //ログアウト処理
        navigate('/login');
      })
    }
  }


  //const image_base_url = process.env.PUBLIC_URL;
  //console.log("image url " + image_base_url)

  const handleChange = (e) => {
    setSetupElements({...setupElements, [e.target.name]: e.target.value});
    if(e.target.name === "agent") {
      let nowAbilityIcons = ["", "", "", ""];
      for(let i = 0; i < 4; i++) {
        nowAbilityIcons[i] = process.env.PUBLIC_URL + "/images/abilitys/" + e.target.value + "Ability" + (i+1) + ".webp";
      }
      setAbilityIcons(nowAbilityIcons);
    }
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
    //console.log("props: " + props)
    return (
      <Box sx={{marginTop:1, marginBottom: 1}} key={props}>
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
            <Box sx={{marginTop:1, marginBottom: 1}} key={image}>
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
          <LoadingButton
            variant="contained"
            onClick={postData}
            loading={loading}
            loadingIndicator="作成中…"
          >
            作成
          </LoadingButton>
        </FormControl>
      </Box>
    )
  }

  const updateButton = () => {
    return (
      <Box sx={{marginTop:1, marginBottom: 1}}>
        <FormControl fullWidth>
          <LoadingButton
          variant="contained"
          onClick={updateData}
          loading={loading}
          loadingIndicator="更新中…"
        >
          更新
        </LoadingButton>
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
          <FormControl sx={{height: 1}} error={isInvalidInput.ability}>
            <RadioGroup
              name="ability"
              value={setupElements.ability}
              onChange={(e) => handleChange(e)}
              sx={{height: 1}}
            >
              <ImageList
                variant='woven'
                cols={10}
                gap={1}
              >
                {commonInfo.abilitys.map((ability) => (  
                  <Radio
                    key={ability}
                    value={ability}
                    icon={
                      <ImageListItem>
                        <img
                          src={`${abilityIcons[ability-1]}?w=164&h=164&fit=crop&auto=format`}
                          srcSet={`${abilityIcons[ability-1]}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                          loading='lazy'
                        />
                      </ImageListItem>
                    }
                    checkedIcon={
                      <ImageListItem sx={{border: 4}}>
                        <img
                          src={`${abilityIcons[ability-1]}?w=164&h=164&fit=crop&auto=format`}
                          srcSet={`${abilityIcons[ability-1]}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
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
        
        {/* createならアップロードフォーム、updateなら登録されている画像を表示 */}
        {/*uploadImageFormList()*/}
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