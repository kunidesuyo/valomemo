import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import SetupCard from './SetupCard';
import Search from './Search';


import { TitleContext } from '../TitleProvider';
import { LoginUsernameContext } from '../LoginUsernameProvider';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';


axios.defaults.withCredentials = true;

export default function Read() {
  const [allSetups, setAllSetups] = useState([]);
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
      axios.get('api/read')
      .then((res) => {
        //console.log(res);
        console.log(res.data);
        setAllSetups(res.data);
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
        <Search
          allSetups={allSetups}
          setups={setups}
          setSetups={setSetups}
        />
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