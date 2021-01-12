/* eslint-disable react/prop-types */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import  { Redirect } from 'react-router-dom'
import { gql, useMutation } from "@apollo/client";

import anon from "../assets/images/anonymous.png";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    maxHeight: 600,
    margin: "0 auto",
  },
  nameStyling: {
    textAlign: "center",
  },
  cardmediaStyling: {
    marginTop: "5%",
    marginBottom: "5%",

    borderRadius: "100%",
  },
  buttonStyling: {
    textAlign: "center",
    margin: "0 auto",
    width: "100%",
  },
});
const FOLLOW_USER = gql`
  mutation FollowUser($user_id: ID!) {
    follow(id: $user_id) {
      id
    }
  }
`;

export default function UserCard(props) {
  const { fullname ,id,username,canFollow} = props;
  const PROFILE_LINK = `/profile/${username}`;
  const classes = useStyles();
  const [followUser] = useMutation(FOLLOW_USER);
  return (
    <Card className={classes.root} key={id}>
      <CardActionArea>
        <CardMedia
          className={classes.cardmediaStyling}
          component="img"
          alt="Avatar"
          image={anon}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="h2"
            className={classes.nameStyling}
          >
            {fullname}
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions>
        <Grid container xs={6}>
          <Button
            size="small"
            color="primary"
            className={classes.buttonStyling}
            onClick={()=>{
              return <Redirect to= {PROFILE_LINK}  />
            }}
          >
            View
          </Button>
        </Grid>
        <Grid container xs={6}>
          <Button
            size="small"
            color="primary"
            className={classes.buttonStyling}
            onClick={ ()=>{
              followUser({
                variables: {
                  user_id: id,
                }
              });
            }}
            style={{
              color: canFollow? "blue" :"red"
            }}
          >
           {canFollow? "Follow":"Unfollow"} 
          </Button>
        </Grid>
      </CardActions>
    </Card>
  );
}
