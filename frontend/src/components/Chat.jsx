import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
// import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";
import { useMediaQuery, useTheme } from "@material-ui/core";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

import { gql, useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { connect } from "react-redux";

import classNames from "classnames";
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
  mutation($receiver: ID!, $text: String!) {
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

const Chat = (props) => {
  const { user } = props;
  const [addMessage] = useMutation(SEND_MESSAGE);

  const res1 = useQuery(GET_MESSAGES, {
    variables: { receiver: user ? user.id : null },
    skip: !user,
  });
  const messageArray = [];
  if (res1.error) return <p>{res1.error.message}</p>;
  if (!res1.data) return <p>No messages.</p>;
  const [getRes2, res2] = useLazyQuery(GET_MESSAGES);

  const [currentReceiver, setCurrentReceiver] = useState("#");

  const classes = useStyles();
  const dummy = useRef();
  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  const [newMessage, setNewMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"), {
    defaultMatches: true,
  });
  const addEmoji = (e) => {
    let emoji = e.native;
    setNewMessage(newMessage + emoji);
  };

  const handleSendMessage = () => {
    addMessage({ variables: { receiver: currentReceiver, text: newMessage } });
    setNewMessage("");
  };
  const [filter , setFilter] = useState("");
  const handleSearchChange = (e)=>{
    setFilter(e.target.value);
  }
  // Dummy Data
  //   const user = {id:100 , fullname:"Ahmed Essam" ,
  //   following:[ {id:1 , fullname:"Khaled"},{id:2 , fullname:"Hassan"}
  //   ,{id:3 , fullname:"Ali"},{id:4 , fullname:"Taha"}]};
  //   let messageArray = [
  //   {key:1 , text:`It is a long established fact that a reader will be distracted by the readable content of
  //   a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less
  //   normal distribution of letters, as opposed to using 'Content here, content here', making it look
  //   like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum
  //   as their default model text,is a long established fact that a reader will be distracted by the readable content of
  //   a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less
  //   normal distribution of letters, as opposed to using 'Content here, content here', making it look
  //   like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum
  //   as their default model text and a search for 'lorem ipsum' will uncover many web sites still in
  //   their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on
  //   purpose (injected humour and the like).`  , date:"09:30" ,sender:true} ,
  //   {key:2 , text:`It is a long established fact that a reader will be distracted by the readable content of
  //   a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less
  //   normal distribution of letters, as opposed to using 'Content here, content here', making it look
  //   like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum
  //   as their default model text,is a long established fact that a reader will be distracted by the readable content of
  //   a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less
  //   normal distribution of letters, as opposed to using 'Content here, content here', making it look
  //   like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum
  //   as their default model text and a search for 'lorem ipsum' will uncover many web sites still in
  //   their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on
  //   purpose (injected humour and the like).`  , date:"09:30" ,sender:false} ,
  //   {key:3 , text:`It is a long established fact that a reader will be distracted by the readable content of
  //   a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less
  //   normal distribution of letters, as opposed to using 'Content here, content here', making it look
  //   like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum
  //   as their default model text,is a long established fact that a reader will be distracted by the readable content of
  //   a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less
  //   normal distribution of letters, as opposed to using 'Content here, content here', making it look
  //   like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum
  //   as their default model text and a search for 'lorem ipsum' will uncover many web sites still in
  //   their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on
  //   purpose (injected humour and the like).`  , date:"09:30" ,sender:true}

  // ]

  return (
    <div>
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
          <List style={{ maxHeight:"460px" ,overflow:"auto"}}>
            {/* Online People */}

            {user.following.map((someuser) => (
              someuser.fullname.includes(filter) &&
              <ListItem
                button
                key={someuser.id}
                onClick={() => {
                  setCurrentReceiver(someuser.id);
                  getRes2({ variables: { receiver: someuser.id } });
                  if (!res1.loading) {
                    res1.data.findMessages.forEach((x) => {
                      if (x.from.id == someuser.id) {
                        messageArray.push(x.findMessages);
                      }
                    });
                    if (res2.data && res2.data.findMessages) {
                      res2.data.findMessages.forEach((x) => {
                        if (x.from.id == user.id) {
                          messageArray.push(x.findMessages);
                        }
                      });
                    }
                    messageArray.sort((a, b) => a.createdAt <= b.createdAt);
                  }
                }}
              >
                <ListItemIcon>
                  <Avatar alt={someuser.fullname} src="" />
                </ListItemIcon>
                <ListItemText primary={someuser.fullname}>
                  {someuser.fullname}
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item sm={12} md={9}>
          <List
            className={classes.messageArea}
            onClick={() => {
              setShowEmoji(false);
            }}
          >
            {messageArray.map((x) => (
              <Message
                key={x.id}
                messageText={x.body}
                messageDate={x.createdAt}
                sender={x.from.id == user.id}
              />
            ))}

            <div ref={dummy}></div>
          </List>

          {showEmoji && (
            <span className={classes.pickerSpanStyling}>
              <Picker onSelect={addEmoji} />
            </span>
          )}
          <Grid container style={{ padding: "20px" , display: currentReceiver=="#" ? "none": "block" }}>
            <Grid container spacing={isMobile ? 4 : 2}>
              <Grid xs={2} sm={1} align="left">
                <Fab
                  color="primary"
                  aria-label="emoji"
                  style={{ backgroundColor: "purple " }}
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
                />
              </Grid>

              <Grid xs={2} sm={1} align="right">
                <Fab
                  color="primary"
                  aria-label="add"
                  style={{ backgroundColor: "purple " }}
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
