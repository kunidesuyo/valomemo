import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';


import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';




import { CommonInfoContext } from '../CommonInfoProvider';


export default function Search(props) {
  const location = useLocation();
  //context
  const commonInfo = useContext(CommonInfoContext);

  let initData = {};
  let initAbilityIcons = ["", "", "", ""];
  const initAbilityIconUrl = process.env.PUBLIC_URL + "/images/abilitys/RP.webp";

  ["map", "agent", "ability"].map((key) => {
    initData[key] = "";
  });
  
  for(let i = 0; i < 4; i++) {
    initAbilityIcons[i] = initAbilityIconUrl;
  }

  const [searchElements, setSearchElements] = useState(initData);
  const [abilityIcons, setAbilityIcons] = useState(initAbilityIcons);
  // const [loading, setLoading] = useState(false);

  //デバック
  useEffect(() => {console.log(searchElements)}, [searchElements]);

  const reset = () => {
    setSearchElements(initData);
  }

  const search = () => {
    // console.log("setups");
    // console.log(props.setups);
    // console.log("allSetups");
    // console.log(props.allSetups);
    // console.log(searchElements);
    //値渡し
    let tempSetups = props.allSetups.slice();
    // console.log(tempSetups);
    Object.entries(searchElements).map(([key, value]) => {
      // console.log(key + " " + value);
      if(value !== '') {
        tempSetups = tempSetups.filter((setup) => {
          return setup[key] === value;
        })
      } 
      //console.log(tempSetups);
    })
    props.setSetups(tempSetups);
  }

  const handleChange = (e) => {
    setSearchElements({...searchElements, [e.target.name]: e.target.value});
    if(e.target.name === "agent") {
      let nowAbilityIcons = ["", "", "", ""];
      for(let i = 0; i < 4; i++) {
        nowAbilityIcons[i] = process.env.PUBLIC_URL + "/images/abilitys/" + e.target.value + "Ability" + (i+1) + ".webp";
      }
      setAbilityIcons(nowAbilityIcons);
    }
  }

  let imageUrls = {};
  commonInfo.agent_names.map((agent_name) => {
    imageUrls[agent_name] = process.env.PUBLIC_URL + "/images/agents/" + agent_name +".webp";
  })


  return (
    <>
      {/* <Container maxWidth="md" sx={{mb: 3}}> */}
        <Accordion sx={{mb: 3}}>
          <AccordionSummary
            // expandIcon={<ExpandMoreIcon />}
          >
            <SearchIcon sx={{mr: 1}}/>
            <Typography>Search</Typography>
          </AccordionSummary>
          <AccordionDetails>
              <Box sx={{marginTop:1, marginBottom: 1}}>
                <Typography variant="h6">Map</Typography>
                <FormControl sx={{minWidth: 120, marginTop:1}} size="small">
                  <Select
                    labelId="map-select"
                    name="map"
                    onChange={(e) => handleChange(e)}
                    value={searchElements.map}
                  >
                    {commonInfo.map_names.map((map) => {
                      return (
                        <MenuItem key={map} value={map}>{map}</MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{marginTop:1, marginBottom: 1}}>
                <Typography variant="h6">Agent</Typography>
                <FormControl sx={{height: 1}} >
                  <RadioGroup
                    name="agent"
                    value={searchElements.agent}
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
                </FormControl>
              </Box>
                          
              <Box sx={{marginTop:1, marginBottom: 1}}>
                <Typography variant="h6">Ability</Typography>
                <FormControl sx={{height: 1}} >
                  <RadioGroup
                    name="ability"
                    value={searchElements.ability}
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
                </FormControl>
              </Box>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                alignItems="center"
                sx={{mr: 1}}
              >
                <Box sx={{marginTop:1, marginBottom: 1, mr: 1}}>
                  <FormControl>
                    <Button
                    variant="contained"
                    onClick={reset}
                  >
                    リセット
                  </Button>
                  </FormControl>
                </Box>
                <Box sx={{marginTop:1, marginBottom: 1, mr: 1}}>
                  <FormControl>
                    <Button
                    variant="contained"
                    onClick={search}
                  >
                    検索
                  </Button>
                  </FormControl>
                </Box>
              </Stack>

          </AccordionDetails>
        </Accordion>
        
      {/* </Container> */}
    </>
  )

}