/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import  { Redirect,useHistory  } from 'react-router-dom'
import { gql, useMutation } from "@apollo/client";
import {  showSnackbar  } from "../state/actions";
import { connect } from "react-redux";

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



function UserCard(props) {
  const { fullname ,id,username,canFollow} = props;
  let history = useHistory();


  const PROFILE_LINK = `/profile/${username}`;
  const classes = useStyles();
  
  const [followUser] = useMutation(FOLLOW_USER, {
    onError(error) {
      showSnackbar("error", error.message);
    },
  }); 
  const [currentIsFollowing , setCurrentIsFollowing]= useState(props.canFollow);
  const useForceUpdate = () =>{
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
  }
  const handleFollowToggle = (id) => {
    followUser({
      variables: {
        user_id: id,
      },
    });

  };
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
              history.push(PROFILE_LINK);

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
              handleFollowToggle(id);
              setCurrentIsFollowing(currentIsFollowing=> !currentIsFollowing);
            }}
            style={{
              color: currentIsFollowing? "blue" :"red"
            }}
          >
           {currentIsFollowing? "Follow":"Unfollow"} 
          </Button>
        </Grid>
      </CardActions>
    </Card>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    
    showSnackbar: (variant, message) =>
      dispatch(showSnackbar(variant, message)),
  };
}
const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserCard);
