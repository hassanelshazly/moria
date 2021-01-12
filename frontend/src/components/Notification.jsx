/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import {  useEffect, useRef } from 'react';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { gql, useQuery } from "@apollo/client";
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import FavoriteSharpIcon from '@material-ui/icons/FavoriteSharp';
import CommentSharpIcon from '@material-ui/icons/CommentSharp';
import PostAddSharpIcon from '@material-ui/icons/PostAddSharp';
import { makeStyles } from '@material-ui/core';

const useStyles=makeStyles(()=>(
    {
        iconStyling:{
            marginRight:"10px",
        }
    }
))
const useImperativeQuery = (query) => {
    const { refetch } = useQuery(query, { skip: true });
      
    const imperativelyCallQuery = (variables) => {
      return refetch(variables);
    } 
      
    return imperativelyCallQuery;
  }

  const GET_NOTIFICATIONS = gql`
  query GetNotifications{
	findNotifications{
    id
    content
    user{
      fullname
    }
    author{
      fullname
    }
    
  }
}
`;







function Notification(props) {
    const callQuery= useImperativeQuery(GET_NOTIFICATIONS);
    const classes = useStyles();
    console.log(props);
    const [notificationArray , setNotificationArray] = useState([]);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const ITEM_HEIGHT = 48;

    // Dummy Data
    // const notificationArray=[{id:1 , content:"FOLLOW" , author:"Ahmed"},
    // {id:2 , content:"COMMENT" , author:"Ahmed"},
    // {id:3 , content:"LIKE" , author:"Ahmed"},
    // {id:4 , content:"POST" , author:"Ahmed"}
    // ];
    return (
        <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <NotificationsActiveIcon  
            onClick={ async () => {
                const {data} = await callQuery();
                console.log(data);
                setNotificationArray(notificationArray=> [ ]);
                data.findNotifications.forEach((x) => {
                    setNotificationArray(notificationArray=> [...notificationArray,{id: x.id , content:x.content ,author:x.author.fullname , } ])
                    });

                    console.log(data.findNotifications);
             }} 
       />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 6.5,
            width:"max-content",

          },
        }}
      >
        {notificationArray.map((x) => (
          <MenuItem key={x.id}  onClick={handleClose}>
            {
                (() => {
                    if (x.content == "FOLLOW")
                        return <><PermIdentityIcon className={classes.iconStyling} /> <p>{x.author} started following you!</p>   </>
                    if (x.content=="LIKE")
                        return <><FavoriteSharpIcon className={classes.iconStyling}/> <p>{x.author} liked a post you are following.</p>   </>
                    if (x.content == "COMMENT")
                        return <><CommentSharpIcon className={classes.iconStyling}/> <p>{x.author} commented on a post you are following.</p>   </>
                    if (x.content=="POST")
                       return <><PostAddSharpIcon className={classes.iconStyling}/> <p>{x.author} posted on their timeline.</p>   </>
                   
                })()
            }
          </MenuItem>
        ))}
      </Menu>
    </div>
    )
}

export default Notification
