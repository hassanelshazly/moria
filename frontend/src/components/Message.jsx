/* eslint-disable react/prop-types */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "emoji-mart/css/emoji-mart.css";
const useStyles = makeStyles(() => ({
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
}));

function Message(props) {
  const { key, messageText, messageDate, sender } = props;
  const classes = useStyles();

  return (
    <ListItem key={key}>
      <Grid container>
        <Grid item xs={12}>
          <ListItemText
            className={sender ? classes.senderStyle : classes.receiverStyle}
            align={sender ? "right" : "left"}
            primary={messageText}
          ></ListItemText>
        </Grid>
        <Grid item xs={12}>
          <ListItemText
            style={{
              paddingRight: sender ? "15px" : "0px",
              paddingLeft: sender ? "0px" : "15px",
            }}
            align={sender ? "right" : "left"}
            secondary={messageDate}
          ></ListItemText>
        </Grid>
      </Grid>
    </ListItem>
  );
}

export default Message;
