/* eslint-disable no-unused-vars */
import { Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";
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
    findAllUsers  { 
      id
      fullname
      username
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
  // eslint-disable-next-line no-unused-vars
  const { loading, error, data } = useQuery(GET_ALL_USERS);
  const { user } = props;

  const USERNAME =  "7assan";

  const {loading:followersLoading , error:followersError, data:followersData} =useQuery(GET_FOLLOWERS , {
    variables: { bla: USERNAME}
  });

  if (error) return `Error! ${error.message}`;
  if(followersError)   return `Error! ${followersError.message}`;
  if(followersLoading || loading)   return <p>Loading ...</p>;
  const classes = useStyles();
  return (
    <Grid container direction={"column"}>
      <Typography className={classes.headerStyle} variant={"h4"}>
        People you may know
      </Typography>

      <Grid item container spacing={4}>
        {followersData.findAllUsers.map((someuser) => {
          if (someuser.id != user.id ) {
            return (
              <Grid item xs={12} sm={6} md={4}>
                <UserCard canFollow={!data.findUser.following.includes(someuser)} name={someuser.fullname} username={someuser.username} id={someuser.id} />
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
