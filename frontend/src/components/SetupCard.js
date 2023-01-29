import React, {useState} from 'react';

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
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
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

  const agentImage = process.env.PUBLIC_URL + "/images/agents/" + setup.agent + ".webp";

  const images = ["position_image", "aim_image", "landing_image"];
  
  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  }

  const handleOpen = () => {
    console.log("open")
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
      <Card sx={{maxWidth: 300}} onClick={handleToggle}>
        <CardMedia
          component="img"
          image={setup.landing_image}
        />
        <CardContent>
          <Stack direction="row" spacing={3}>
            <Avatar src={agentImage} sx={{width: 30, height: 30}}/>
            <Typography variant="h6">{setup.ability}</Typography>
          </Stack>
          <Typography variant="h6" sx={{marginTop: 1}}>{setup.title}</Typography>
        </CardContent>
      </Card>

      <Backdrop
        open={open}
      >
        <Card sx={{maxWidth: "50%", p: 2}}>
          <Box>
            <CardMedia
              component="img"
              image={setup[images[displayImageIndex]]}
            />
            <Grid container>
              <Grid item xs={4}></Grid>
              <Grid item xs={2}>
                <Container sx={{textAlign: "center"}}>
                  <Button onClick={displayPreviousImage}> {"<"} </Button>
                </Container>
              </Grid>
              <Grid item xs={2}>
                <Container sx={{textAlign: "center"}}>
                  <Button onClick={displayNextImage}>{">"}</Button>
                </Container>
              </Grid>
              <Grid item xs={4}></Grid>
            </Grid>
          </Box>
          <CardContent>
            <Stack direction="row" spacing={3} sx={{marginBottom: 1}}>
              <Avatar src={agentImage} sx={{width: 30, height: 30}}/>
              <Typography variant="subtitle1">{setup.ability}</Typography>
              <Typography variant="subtitle1">{setup.map}</Typography>
            </Stack>
            <Typography variant="subtitle1">{setup.title}</Typography>
            <Typography variant="body1">{setup.description}</Typography>
          </CardContent>
          <CardActions>
            <Grid container>
              <Grid item xs={3}>
                <Button onClick={handleClose} variant="contained">閉じる</Button>
              </Grid>
              <Grid item xs={5}></Grid>
              <Grid item xs={4} sx={{textAlign: "right"}}>
                <Button
                  variant="contained"
                  component={Link}
                  to="/update"
                  state={setup}
                  sx={{marginRight: 2}}
                >
                  編集
                </Button>
                <Delete id={setup.id} detectDelete={props.detectDelete} setDetectDelete={props.setDetectDelete}/>
              </Grid>
            </Grid>
            
          </CardActions>
        </Card>
      </Backdrop>
    </Box>
  )
}