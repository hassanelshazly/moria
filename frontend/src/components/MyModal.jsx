/* eslint-disable */
import {
  Grid,
  List,
  Avatar,
  Button,
  Modal,
  AppBar,
  Tab,
  Box,
  Tabs,
  Typography,
} from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { useHistory } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
function MyModal(props) {
  const classes = useStyles();
  let history = useHistory();

  const [value, setValue] = React.useState(1);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={props.open}
      onClose={props.handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.open}>
        <Grid
          container
          direction={"column"}
          style={{
            margin: "0",
            width: "400px",
            backgroundColor: "white",
            borderRadius: "20px",
            height: "380px",
          }}
        >
          <Grid item>
            <div className={classes.root}>
              <AppBar position="static" color="default">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                >
                  <Tab label="Followers" style={{ width: "200px" }} />
                  <Tab label="Following" style={{ width: "200px" }} />
                </Tabs>
              </AppBar>
              <TabPanel
                value={value}
                index={0}
                style={{ overflowY: "auto", height: "300px" }}
              >
                {props.followers.map((someuser) => (
                  <ListItem
                    key={someuser.id}
                    button
                    onClick={() => {
                      const PROFILE_LINK = `/profile/${someuser.username}`;

                      history.push(PROFILE_LINK);
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
                ))}
              </TabPanel>
              <TabPanel
                value={value}
                index={1}
                style={{ overflowY: "auto", height: "300px" }}
              >
                {props.following.map((someuser) => (
                  <ListItem
                    key={someuser.id}
                    button
                    onClick={() => {
                      const PROFILE_LINK = `/profile/${someuser.username}`;

                      history.push(PROFILE_LINK);
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
                ))}
              </TabPanel>
            </div>
          </Grid>
        </Grid>
      </Fade>
    </Modal>
  );
}

export default MyModal;
