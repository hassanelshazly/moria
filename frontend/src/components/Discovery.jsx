/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types";
import { CircularProgress, Grid, makeStyles, Typography } from "@material-ui/core";
import UserCard from "./UserCard";

import { gql, useQuery } from "@apollo/client";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles(() => {
  return {
    headerStyle: {
      textAlign: "center",
      marginBottom: "20px",
      marginTop: "20px",
      textTransform: "capitalize",
    },
  };
});

const GET_ALL_USERS = gql`
  query GetAllUsers {
    findAllUsers {
      id
      username
      fullname
    }
  }
`;
const GET_FOLLOWERS = gql`
  query GetFollowers($bla: String!)
  {
    findUser(username: $bla)
    {
      following
      {
        username
        fullname
        id
      }
    }
  }
`;

function Discovery(props) {
  const { user } = props;
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_ALL_USERS);


  const {loading:followersLoading , error:followersError, data:followersData} =useQuery(GET_FOLLOWERS , {
    variables: { bla: user?user.username:""}
  });
  

  if (loading || followersLoading ) 
    {return (
      <CircularProgress
        style={{
          width: "100px",
          height: "100px",
          position: "absolute",
          top: "50%",
          left: "50%",
        }}
        color="primary"
      />
    );
      }

  if (error) return `Error! ${error.message}`;
  if(followersError) return `Error! ${followersError.message}`;

  if(!followersData || followersData==null) return <p>Hii</p>;
  const currentlyFollowing=[];
  followersData.findUser.following.forEach(x=>{
    currentlyFollowing.push(x.username);
  })



  return (
    <Grid container direction={"column"}>
      <Typography className={classes.headerStyle} variant={"h4"}>
        People you may know
      </Typography>

      <Grid item container spacing={4}>
        {data.findAllUsers.map((someuser) => {
          if (user!= null && someuser.id !=user.id  ) {
            return (
              <Grid item xs={12} sm={6} md={4}>
                <UserCard canFollow={!currentlyFollowing.includes(someuser.username)} fullname={someuser.fullname} username={someuser.username} id={someuser.id} />
              </Grid>
            );
          }
        })}
      </Grid>
    </Grid>
  );
}

Discovery.propTypes = {
  user: PropTypes.any,
};

const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps)(Discovery);
