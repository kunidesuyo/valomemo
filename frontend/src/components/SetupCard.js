import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';




export default function SetupCard(props) {
  const setup = props.setup;
  console.log(setup);

  const agentImage = process.env.PUBLIC_URL + "/images/" + setup.agent + ".webp";

  return (
    <Card sx={{maxWidth: 300}}>
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
  )
}