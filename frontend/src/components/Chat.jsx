/* eslint-disable react/prop-types */
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
import useSound from "use-sound";
import { formatDistance } from "date-fns";

import { CircularProgress, useMediaQuery, useTheme } from "@material-ui/core";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";
import { connect } from "react-redux";
import lottie from "lottie-web";
import uuidv4 from "../utils/uuid";
import classNames from "classnames";
import Message from "./Message";

import MessageSound from "../assets/sounds/message-sound.mp3";
import Skeleton from "@material-ui/lab/Skeleton";

let messageArrayLoading = false;

const skeletonHolder = Array.from(
  { length: Math.floor(Math.random() * (12 - 4 + 1)) + 4 },
  () => Math.floor(Math.random() * 100)
);

const useImperativeQuery = (query) => {
  const { refetch } = useQuery(query, { skip: true });

  const imperativelyCallQuery = (variables) => {
    return refetch(variables);
  };

  return imperativelyCallQuery;
};

const useStyles = makeStyles((theme) => ({
  holder: {
    position: "relative",
  },
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
  },
  container: {
    position: "absolute",
    width: "400px",
    height: "400px",
    overflow: "hidden",

    [theme.breakpoints.down("md")]: {
      position: "absolute",
      top: "10vh",
      left: "1.5vw",
      width: "300px",
      height: "300px",
    },
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
    bottom: "10vh",
    zIndex: "1",
    [theme.breakpoints.up("md")]: {
      left: "1vw",
    },
    [theme.breakpoints.down("md")]: {
      left: "1vw",
    },
    [theme.breakpoints.down("sm")]: {
      left: "1",
      bottom: "11vh",
    },
  },
  peopleList: {
    [theme.breakpoints.down("sm")]: {},
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
  query GetFollowers($bla: String!) {
    findUser(username: $bla) {
      profileUrl
      following {
        username
        fullname
        id
        profileUrl
      }
    }
  }
`;
const MESSAGE_SUBSCRIPTION = gql`
  subscription onNewMessage {
    newMessage {
      id
      body
      from {
        id
      }
      createdAt
    }
  }
`;

const Chat = (props) => {
  const { user } = props;

  if (user == null) {
    return <p>Loading ...</p>;
  }

  const container = useRef(null);
  useEffect(() => {
    lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      autoplay: true,
      loop: true,
      animationData: require("./../assets/animations/message-received.json"),
    });
  });
  const classes = useStyles();
  const theme = useTheme();
  const dummy = useRef();
  const [currentReceiver, setCurrentReceiver] = useState("#");
  const [newMessage, setNewMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [filter, setFilter] = useState("");
  const [play] = useSound(MessageSound);

  const USERNAME = user.username;

  const { loading, error, data } = useQuery(GET_FOLLOWERS, {
    variables: { bla: USERNAME },
  });

  const callQuery = useImperativeQuery(GET_MESSAGES);
  // const [getRes2, res2] = useLazyQuery(GET_MESSAGES);

  const [addMessage] = useMutation(SEND_MESSAGE);
  const [messageArray, setMessageArray] = useState([]);
  useEffect(() => {
    if (dummy.current) dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [dummy.current, messageArray]);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
    defaultMatches: true,
  });

  const { error: subError } = useSubscription(MESSAGE_SUBSCRIPTION, {
    onSubscriptionData({ subscriptionData: { data: subData } }) {
      if (
        subData &&
        (messageArray.length == 0 ||
          subData.newMessage.id != messageArray[messageArray.length - 1].id) &&
        currentReceiver != "#" &&
        subData.newMessage.from.id === currentReceiver
      ) {
        play();
        setMessageArray((messageArray) => [
          ...messageArray,
          {
            id: subData.newMessage.id,
            createdAt: subData.newMessage.createdAt,
            body: subData.newMessage.body,
            sender: false,
          },
        ]);
      }
    },
  });

  if (subError) console.error(subError);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const addEmoji = (e) => {
    let emoji = e.native;
    setNewMessage(newMessage + emoji);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() == "") return;
    // setMessageArray([...messageArray,{id:x.id ,createdAt:x.createdAt , body:x.body , sender:x.from.id==user.id} ])
    //console.log("Current Receiver  " + currentReceiver + " Text: " + newMessage);
    addMessage({ variables: { receiver: currentReceiver, text: newMessage } });
    setMessageArray((messageArray) => [
      ...messageArray,
      {
        id: uuidv4(),
        createdAt: new Date().getTime(),
        body: newMessage,
        sender: true,
      },
    ]);
    setNewMessage("");
  };

  const handleSearchChange = (e) => {
    setFilter(e.target.value);
  };

  if (loading)
    return (
      <CircularProgress
        style={{
          width: "100px",
          height: "100px",
          position: "absolute",
          top: isMobile ? "40%" : "45%",
          left: isMobile ? "40%" : "45%",
        }}
        color="primary"
      />
    );

  if (error || !data.findUser) return <p>Error :(</p>;

  return (
    <div>
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid
          item
          xs={isMobile ? 12 : 4}
          className={classNames(classes.peopleList, classes.borderRight500)}
        >
          <List>
            <ListItem button key={user.id}>
              <ListItemIcon>
                <Avatar
                  alt={user.fullname}
                  src={data.findUser.profileUrl ? data.findUser.profileUrl : ""}
                />
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
                someuser.fullname
                  .toLowerCase()
                  .includes(filter.toLowerCase()) && (
                  <ListItem
                    button
                    key={someuser.id}
                    style={{
                      backgroundColor:
                        currentReceiver == someuser.id
                          ? "rgb(44 225 210 / 19%)"
                          : "white",
                    }}
                    onClick={async () => {
                      setCurrentReceiver(someuser.id);
                      messageArrayLoading = true;
                      setMessageArray(() => []);

                      const { data, loading } = await callQuery({
                        receiver: someuser.id,
                      });
                      if (!loading) {
                        messageArrayLoading = false;
                      }
                      setMessageArray(() => []);

                      // if(error) { return;}
                      data.findMessages.forEach((x) => {
                        setMessageArray((messageArray) => [
                          ...messageArray,
                          {
                            id: x.id,
                            createdAt: x.createdAt,
                            body: x.body,
                            sender: x.from.id == user.id,
                          },
                        ]);
                      });
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        alt={someuser.fullname}
                        src={someuser.profileUrl}
                      />
                    </ListItemIcon>
                    <ListItemText primary={someuser.fullname}>
                      {someuser.fullname}
                    </ListItemText>
                  </ListItem>
                )
            )}
          </List>
        </Grid>

        {isMobile && (
          <Grid xs={12} style={{ margin: "10px 0" }}>
            <Divider />
          </Grid>
        )}
        <Grid item xs={isMobile ? 12 : 8} className={classes.holder}>
          <List
            className={classes.messageArea}
            onClick={() => {
              setShowEmoji(false);
            }}
          >
            {currentReceiver == "#" && (
              <div className={classes.container} ref={container}>
                {" "}
              </div>
            )}
            {currentReceiver != "#" && messageArrayLoading && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                {skeletonHolder.map((id) => (
                  <Skeleton
                    key={id}
                    variant="rect"
                    animation="wave"
                    align="right"
                    width={Math.floor(Math.random() * (240 - 80 + 1)) + 80}
                    height={Math.floor(Math.random() * (60 - 20 + 1)) + 20}
                    style={{
                      alignSelf: id % 2 == 0 ? "flex-start" : "flex-end",
                      marginBottom: "10px",
                      marginRight: id % 2 == 0 ? "0" : "10px",
                      backgroundColor:
                        id % 2 == 0 ? "#E0DBDA" : "rgb(44,225,210)",
                      marginLeft: id % 2 == 0 ? "10px" : "0px",
                      borderRadius: "20px",
                    }}
                  ></Skeleton>
                ))}
                {/* <Skeleton variant="rect" animation="wave" width={Math.floor(Math.random() * 240)} height={Math.floor(Math.random() * 140)}  style={{ borderRadius:"30px"}}/> */}
              </div>
            )}

            {messageArray.map((x) => (
              <Message
                ISSMALL={isMobile}
                key={x.id}
                messageText={x.body}
                messageDate={formatDistance(
                  new Date(Number(x.createdAt, 10)),
                  new Date()
                )}
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
              padding: "10px",
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

const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps)(Chat);
