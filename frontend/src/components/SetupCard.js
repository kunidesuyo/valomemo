import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Modal from '@mui/material/Modal';


import ClickAwayListener from '@mui/base/ClickAwayListener';



import Delete from './Delete';

//Swiper
/*import { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/navigation";*/


export default function SetupCard(props) {
  const [open, setOpen] = useState(false);
  const setup = props.setup;
  const [displayImageIndex, setDisplayImageIndex] = useState(0);
  //console.log(setup);

  const agentIcon = process.env.PUBLIC_URL + "/images/agents/" + setup.agent + ".webp";
  const abilityIcon = process.env.PUBLIC_URL + "/images/abilitys/" + setup.agent + "Ability" + setup.ability + ".webp";

  const images = ["position_image", "aim_image", "landing_image"];

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  }

  const handleOpen = () => {
    //console.log("open")
    setOpen(true);
  }

  /*const handleDisplayImage = (i) => {
    setDisplayImageIndex((displayImageIndex + i) % 3);
  }*/
  const displayPreviousImage = () => {
    const len = images.length;
    setDisplayImageIndex((displayImageIndex + len - 1) % len)
  }

  const displayNextImage = () => {
    const len = images.length;
    setDisplayImageIndex((displayImageIndex + len + 1) % len)
  }

  return (
    <Box>
      <Card sx={{ maxWidth: "100%" }} onClick={handleToggle}>
        <CardMedia
          component="img"
          image={setup.landing_image}
        />
        <CardContent>
          <Stack direction="row" spacing={3}>
            <Avatar src={agentIcon} sx={{ width: 30, height: 30 }} />
            <Avatar src={abilityIcon} sx={{ width: 30, height: 30 }} />
          </Stack>
          <Typography variant="h6" sx={{ marginTop: 1 }}>{setup.title}</Typography>
        </CardContent>
      </Card>

      <Modal
        open={open}
        // sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        onClose={handleClose}
      >
        <Card
          sx={{
            maxWidth: "50%", p: 2, position: 'absolute',
            top: '50%', left: '50%', transform: 'translate(-50%, -50%)'
          }}
        >
          <CardMedia
            component="img"
            image={setup[images[displayImageIndex]]}
          />
          <CardActions>
            <Grid container>
              <Grid item xs={4}></Grid>
              <Grid item xs={2}>
                <Box sx={{ textAlign: "center", maxWidth: "100%" }}>
                  <Button onClick={displayPreviousImage}> {"<"} </Button>
                </Box>
              </Grid>
              <Grid item xs={2}>
                <Box sx={{ textAlign: "center", maxWidth: "100%" }}>
                  <Button onClick={displayNextImage}>{">"}</Button>
                </Box>
              </Grid>
              <Grid item xs={4}></Grid>
            </Grid>
          </CardActions>

          <CardContent>
            <Stack direction="row" spacing={3} sx={{ marginBottom: 1 }}>
              <Avatar src={agentIcon} sx={{ width: 30, height: 30 }} />
              <Avatar src={abilityIcon} sx={{ width: 30, height: 30 }} />
              <Typography variant="subtitle1">{setup.map}</Typography>
            </Stack>
            <Typography variant="subtitle1">{setup.title}</Typography>
            <Typography variant="body1">{setup.description}</Typography>
          </CardContent>

          <Stack
            direction="row"
            spacing={1}
            justifyContent="flex-end"
            alignItems="center"
            sx={{ mr: 1 }}
          >
            <Box sx={{ marginTop: 1, marginBottom: 1, mr: 1 }}>
              <Button
                variant="contained"
                component={Link}
                to="/update"
                state={{ setup: setup, createOrUpdate: "update" }}
                sx={{ marginRight: 2 }}
              >
                編集
              </Button>
            </Box>
            <Box sx={{ marginTop: 1, marginBottom: 1, mr: 1 }}>
              <Delete setup={setup} detectDelete={props.detectDelete} setDetectDelete={props.setDetectDelete} />
            </Box>
          </Stack>
        </Card>
      </Modal>
    </Box>

  )
}