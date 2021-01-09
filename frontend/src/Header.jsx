import { AppBar, Typography,Toolbar } from '@material-ui/core'
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';import React from 'react'
import {makeStyles} from "@material-ui/styles"; 

const useStyles = makeStyles(()=>{
    return {
        typographyStyles:{
            flex:1,
        }
    }
})
function Header() {
    const classes= useStyles();
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography className={classes.typographyStyles}>Ahmed Essam</Typography>
                <AddCircleRoundedIcon  />
            </Toolbar>
        </AppBar>
    )
}

export default Header
