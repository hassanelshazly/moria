/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";

import { CircularProgress, useMediaQuery, useTheme } from "@material-ui/core";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

import { gql, useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { connect } from "react-redux";
import lottie from 'lottie-web';
import classNames from "classnames";
import Message from "./Message";


const useImperativeQuery = (query) => {
  const { refetch } = useQuery(query, { skip: true });
	
  const imperativelyCallQuery = (variables) => {
    return refetch(variables);
  } 
	
  return imperativelyCallQuery;
}
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
  },
  container:{
    width:"400px",
    height:"400px"
  },
  headBG: {
    backgroundColor: "#rgb(44,225,210)",
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
    backgroundColor: "rgb(44,225,210)",
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
  pickerSpanStyling: {
    position: "absolute",
    bottom: "20vh",
    zIndex: "1",
    [theme.breakpoints.up("md")]: {
      left: "37.9vw",
    },
    [theme.breakpoints.down("md")]: {
      left: "35vw",
    },
    [theme.breakpoints.down("sm")]: {
      left: "10vw",
      bottom: "22vh",
    },
  },
  peopleList: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

const GET_MESSAGES = gql`
  query GetMessages($receiver: ID!) {
    findMessages(toUserId: $receiver) {
      id
      from {
        id
      }
      to {
        ... on User {
          id
        }
        ... on GroupChat {
          id
        }
      }
      body
      createdAt
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($receiver: ID!, $text: String!) {
    sendMessage(toUserId: $receiver, body: $text) {
      id
      from {
        id
      }
      to {
        ... on User {
          id
        }
        ... on GroupChat {
          id
        }
      }
      body
      createdAt
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


const Chat = (props) => {
  const container = useRef(null);
  useEffect(()=>{
      lottie.loadAnimation({
        container:container.current,
        renderer:'svg',
        autoplay:true,
        loop:true,
        animationData:require('./../message-received.json')
      })
  })
  const { user } = props;
  const classes = useStyles();
  const theme = useTheme();
  const dummy = useRef();
  const [currentReceiver, setCurrentReceiver] = useState("#");
  const [newMessage, setNewMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [filter, setFilter] = useState("");
  const USERNAME = user.username;

    
    const {loading , error, data} =useQuery(GET_FOLLOWERS , {
      variables: { bla: USERNAME}
    });


  const callQuery= useImperativeQuery(GET_MESSAGES);
  // const [getRes2, res2] = useLazyQuery(GET_MESSAGES);

  const [addMessage] = useMutation(SEND_MESSAGE);

  const [messageArray , setMessageArray] = useState([]);
  useEffect(() => {
    if (dummy.current) dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [dummy.current , messageArray]);

  const isMobile = useMediaQuery(theme.breakpoints.down("xs"), {
    defaultMatches: true,
  });
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  }


  const addEmoji = (e) => {
    let emoji = e.native;
    setNewMessage(newMessage + emoji);
  };

  const handleSendMessage = () => {
    if(newMessage.trim()=="") return;
    // setMessageArray([...messageArray,{id:x.id ,createdAt:x.createdAt , body:x.body , sender:x.from.id==user.id} ])
    //console.log("Current Receiver  " + currentReceiver + " Text: " + newMessage);
     addMessage({ variables: { receiver: currentReceiver, text: newMessage } });
    setNewMessage("");
  };

  const handleSearchChange = (e) => {
    setFilter(e.target.value);
  };

  
  if (loading) return <CircularProgress style={{width:"100px" , height:"100px" ,position:"absolute" , top:"50%" , left:"50%"}} 
  color="primary" />

  if (error) return <p>Error :(</p>;


  return (
    <div >
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid
          item
          xs={3}
          className={classNames(classes.peopleList, classes.borderRight500)}
        >
          <List>
            <ListItem button key={user.id}>
              <ListItemIcon>
                <Avatar alt={user.fullname} src="" />
              </ListItemIcon>
              <ListItemText primary={user.fullname}></ListItemText>
            </ListItem>
          </List>

          <Divider />
          <Grid item xs={12} style={{ padding: "10px" }}>
            <TextField
              id="outlined-basic-email"
              label="Search"
              variant="outlined"
              onChange={handleSearchChange}
              fullWidth
            />
          </Grid>
          <Divider />
          <List style={{ maxHeight: "460px", overflow: "auto" }}>
            {/* Online People */}
            {data.findUser.following.map(
              (someuser) =>
                someuser.fullname.toLowerCase().includes(filter.toLowerCase()) && (
                  <ListItem
                    button
                    key={someuser.id}
                    style={{backgroundColor: currentReceiver == someuser.id ? "rgb(122 0 93 / 15%)" : "white"}}
                    onClick={ async () => {
                      setCurrentReceiver(someuser.id);
                      const {data,error} = await callQuery({receiver:someuser.id})
                      setMessageArray(messageArray=> [ ]);

                     // if(error) { return;}
                      data.findMessages.forEach((x) => {

                              setMessageArray(messageArray=> [...messageArray,{id:x.id ,createdAt:x.createdAt , body:x.body , sender:x.from.id==user.id} ])
                          });
                        console.log(messageArray)
                      
                    }}
                  >
                    <ListItemIcon>
                      <Avatar alt={someuser.fullname} src="" />
                    </ListItemIcon>
                    <ListItemText primary={someuser.fullname}>
                      {someuser.fullname}
                    </ListItemText>
                  </ListItem>
                )
            )}
          </List>
        </Grid>
        <Grid item sm={12} md={9}>
          <List
            className={classes.messageArea}
            onClick={() => {
              setShowEmoji(false);
            }}
          >
            {currentReceiver=="#" && 
              <div className={classes.container} ref={container}> </div>
            }
            {messageArray.map((x) => (
              <Message
                key={x.id}
                messageText={x.body}
                messageDate={x.createdAt}
                sender={x.sender}
              />
            ))}

            <div ref={dummy}></div>
          </List>

          {showEmoji && (
            <span className={classes.pickerSpanStyling}>
              <Picker onSelect={addEmoji} />
            </span>
          )}
          <Grid
            container
            style={{
              padding: "20px",
              display: currentReceiver == "#" ? "none" : "block",
            }}
          >
            <Grid container spacing={isMobile ? 4 : 2}>
              <Grid xs={2} sm={1} align="left">
                <Fab
                  color="primary"
                  aria-label="emoji"
                  style={{ backgroundColor: "rgb(44,225,210)" }}
                  onClick={() => {
                    setShowEmoji(!showEmoji);
                  }}
                >
                  <EmojiEmotionsIcon />
                </Fab>
              </Grid>
              <Grid item xs={8} sm={10}>
                <TextField
                  id="outlined-basic-email"
                  label="Type Something"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                  }}
                  fullWidth
                  onKeyPress={handleKeyPress}
                />
              </Grid>

              <Grid xs={2} sm={1} align="right">
                <Fab
                  color="primary"
                  aria-label="add"
                  style={{ backgroundColor: "rgb(44,225,210)" }}
                  onClick={handleSendMessage}
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

Chat.propTypes = {
  user: PropTypes.any,
};

const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps)(Chat);
