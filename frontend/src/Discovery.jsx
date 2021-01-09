import { Grid,makeStyles,Typography } from '@material-ui/core';
import React from 'react'
import UserCard from "./UserCard";
import pi1 from "./temp_profile_imgs/1.png"
import pi2 from "./temp_profile_imgs/2.png"
import pi3 from "./temp_profile_imgs/3.png"
import pi4 from "./temp_profile_imgs/4.png"
import pi5 from "./temp_profile_imgs/5.png"
import pi6 from "./temp_profile_imgs/6.png"
import pi7 from "./temp_profile_imgs/7.png"

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
function Discovery() {
    const classes= useStyles();
    return (
        <Grid container direction={"column"}>

        <Typography className={classes.headerStyle} variant={"h4"}>People you may know</Typography>
         
        <Grid item container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
               <UserCard name={"Ahmed Essam"} profileImg={pi1}/>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
               <UserCard name={"Hassan"} profileImg={pi2}/>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
               <UserCard name={"Khaled"} profileImg={pi3}/>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
               <UserCard name={"Hosni"} profileImg={pi5}/>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
               <UserCard name={"Radwa"} profileImg={pi4}/>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
               <UserCard name={"Eslam"} profileImg={pi6}/>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
               <UserCard name={"Hussien"} profileImg={pi7}/>
            </Grid>
           
            </Grid>
            
            


        </Grid>

    )
}

export default Discovery
