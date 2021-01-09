/* eslint-disable no-unused-vars */
import React, { useRef, useEffect , useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";
import { useMediaQuery, useTheme } from "@material-ui/core";
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

import classNames from 'classnames'
import Message from "./Message";
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
    // backgroundColor:"red"
  },
  messageArea: {
    height: "70vh",
    overflowY: "auto",
  },
  senderStyle: {
    backgroundColor: "purple",
    color: "white",
    paddingRight: "20px",
    paddingLeft: "15px",
    paddingTop: "10px",
    paddingBottom: "10px",
    borderRadius: "30px",
  },
  receiverStyle: {
    backgroundColor: "#E0DBDA",
    color: "black",
    paddingRight: "20px",
    paddingLeft: "15px",
    paddingTop: "10px",
    paddingBottom: "10px",
    borderRadius: "30px",
  },
  pickerSpanStyling:{
    position:"absolute",
    bottom:"23vh",
    left:"400px",
    [theme.breakpoints.up("md")]: {
      left:"25vw",

    },
    [theme.breakpoints.down("md")]: {
      left:"25vw",

    },
    [theme.breakpoints.down("sm")]: {
      left:"0",

    },
  },
  peopleList: {
    [theme.breakpoints.down("sm")]: {
      display:"none"
    },
  },
}));

const Chat = () => {
  const classes = useStyles();
  const dummy = useRef();
  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  const [newMessage , setNewMessage] = useState("");
  const [showEmoji , setShowEmoji] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'), {
    defaultMatches: true
  });
  const addEmoji = e => {
    let emoji = e.native;
    setNewMessage(newMessage + emoji);
  };
  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Paper elevation="2"  style={{borderRadius:"30px"}}>
            <Typography
              style={{ textAlign: "center", borderRadius: "50px" }}
              variant="h4"
            >
              Chat
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={3} className={classNames(classes.peopleList,classes.borderRight500)}>
          <List>
            <ListItem button key="AhmedEssam">
              <ListItemIcon>
                <Avatar alt="Ahmed Essam" src="" />
              </ListItemIcon>
              <ListItemText primary="Ahmed Essam"></ListItemText>
            </ListItem>
          </List>

          <Divider />
          <Grid item xs={12} style={{ padding: "10px" }}>
            <TextField
              id="outlined-basic-email"
              label="Search"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Divider />
          <List > 
            {/* Online People */}
            <ListItem button key="KhaledEmara">
              <ListItemIcon>
                <Avatar alt="Khaled Emara" src="" />
              </ListItemIcon>
              <ListItemText primary="Khaled Emara">Khaled Emara</ListItemText>

              <ListItemText
                disableTypography
                secondary={
                  <Typography type="body2" style={{ color: "green", fontWeight: "bold" }} >
                    Online
                  </Typography>
                }
                align="right"
              ></ListItemText>
            </ListItem>

            <ListItem button key="Hassan">
              <ListItemIcon>
                <Avatar alt="Hassan" src="" />
              </ListItemIcon>
              <ListItemText primary="Hassan">Hassan</ListItemText>
            </ListItem>

            <ListItem button key="Eslam">
              <ListItemIcon>
                <Avatar alt="Eslam" src="" />
              </ListItemIcon>
              <ListItemText primary="Eslam">Eslam</ListItemText>
            </ListItem>


          </List>
        </Grid>
        <Grid item sm={12} md={9}>
          <List className={classes.messageArea} onClick={()=>{setShowEmoji(false)}}>
            <Message  key="1" messageText="It is a long established fact that a reader will be distracted by the readable content of 
                    a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less
                    normal distribution of letters, as opposed to using 'Content here, content here', making it look 
                    like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum 
                    as their default model text,is a long established fact that a reader will be distracted by the readable content of 
                    a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less
                    normal distribution of letters, as opposed to using 'Content here, content here', making it look 
                    like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum 
                    as their default model text and a search for 'lorem ipsum' will uncover many web sites still in
                    their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on 
                    purpose (injected humour and the like)." messageDate="09:30" sender={true} />
            <Message  key="2" messageText="readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum 
                    as their default model text,is a long established fact that a reader will be distracted by the readable content of 
                    a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less
                    normal distribution of letters, as opposed to using 'Content here, content here', making it look 
                    like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum 
                    as their default model text and a search for 'lorem ipsum' will uncover many web sites still in
                    their infancy." messageDate="09:31" sender={false} />
            <Message  key="3" messageText="It is a long established fact that a reader will be distracted by the readable content of 
                    a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less
                    normal distribution of letters, as opposed to using 'Content here, content here', making it look 
                    like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum 
                    as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in
                    their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on 
                    purpose (injected humour and the like). distribution of letters, as opposed to using 'Content here, content here', making it look 
                    like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum 
                    as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in
                    their infancy. Various English. Many desktop publishing packages and web page editors now use Lorem Ipsum 
                    as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in
                    their infancy. Various" messageDate="10:30" sender={true} />
            
            <div ref={dummy}></div>
          </List>

          {showEmoji &&
          <span className={classes.pickerSpanStyling}>
              <Picker onSelect={addEmoji} />
          </span>}
          <Grid container style={{ padding: "20px" }}>



            <Grid container spacing={isMobile? 4 : 2}>
              <Grid xs={2} sm={1} align="left" >
                <Fab
                  color="primary"
                  aria-label="emoji"
                  style={{ backgroundColor: "purple " }}
                  onClick={()=>{setShowEmoji(!showEmoji)}}
                >
                  <EmojiEmotionsIcon   />
                </Fab>
              </Grid>
              <Grid item xs={8} sm={10} >

                <TextField
                  id="outlined-basic-email"
                  label="Type Something"
                  value={newMessage}
                  onChange={e=>{setNewMessage(e.target.value)}}
                  fullWidth
                />
              </Grid>
            

              <Grid xs={2} sm={1} align="right">
                <Fab
                  color="primary"
                  aria-label="add"
                  style={{ backgroundColor: "purple " }}
                >
                  <SendIcon />
                </Fab>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Chat;
