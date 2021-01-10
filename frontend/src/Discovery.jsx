import { Grid,makeStyles,Typography } from '@material-ui/core';
import React from 'react'
import UserCard from "./UserCard";
import { gql, useQuery } from '@apollo/client';
import { useStateValue } from "<path to root>/state/store";




const useStyles = makeStyles(()=>{
    return {
        headerStyle:{
            textAlign:"center",
            marginBottom:"20px",
            marginTop:"20px",
            textTransform:"capitalize"
        }
    }
})
const GET_ALL_USERS = gql`
  query GetAllUsers() {
    findAllUsers  { //TODO: Change query Name
      id
      fullname
    }
  }
`;
function Discovery() {
   // eslint-disable-next-line no-unused-vars
   const { loading, error, data } = useQuery(GET_ALL_USERS);
   const [{ user }] = useStateValue();
   
   if (error) return `Error! ${error.message}`;

   const classes= useStyles();
    return (
        <Grid container direction={"column"}>

        <Typography className={classes.headerStyle} variant={"h4"}>People you may know</Typography>
         
        <Grid item container spacing={4}>

           {
              data.findAllUsers.map(someuser=>{
                 if(someuser.id != user.id)
                 {
                    return (
                           <Grid item xs={12} sm={6} md={4}>
                                 <UserCard name={someuser.fullname} />
                           </Grid>
                    )
                 }
              })
           }
            


            
           
            </Grid>
            
            


        </Grid>

    )
}

export default Discovery
