/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles, ThemeProvider, useTheme } from "@material-ui/core/styles";
import AccountCircleTwoTone from "@material-ui/icons/AccountCircleTwoTone";
import Avatar from "@material-ui/core/Avatar";
import AppBar from "@material-ui/core/AppBar";
import ChatIcon from "@material-ui/icons/Chat";
import Container from "@material-ui/core/Container";
import CreateIcon from "@material-ui/icons/Create";
import CreatePostDialog from "../dialogs/CreatePostDialog";
import Dialog from "@material-ui/core/Dialog";
import Divider from "@material-ui/core/Divider";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import Drawer from "@material-ui/core/Drawer";
import FaceIcon from "@material-ui/icons/Face";
import GroupIcon from "@material-ui/icons/Group";
import Hidden from "@material-ui/core/Hidden";
import HomeIcon from "@material-ui/icons/Home";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownRoundedIcon from "@material-ui/icons/KeyboardArrowDownRounded";
import KeyboardArrowLeftRoundedIcon from "@material-ui/icons/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@material-ui/icons/KeyboardArrowRightRounded";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Logo from "../assets/images/logo192.png";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import SearchBar from "./SearchBar";
import SignUpDialog from "../dialogs/SignUpDialog";
import SignInDialog from "../dialogs/SignInDialog";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContentWrapper from "../components/SnackbarContentWrapper";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Switch from "@material-ui/core/Switch";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import styled from 'styled-components'
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  setDialog,
  setMenuAnchor,
  setUser,
  setSnackbar,
  showSnackbar,
} from "../state/actions";

const drawerWidth = 240;
export let isItDark = false;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  grow: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up("sm")]: {
      // zIndex: theme.zIndex.drawer + 1,
      marginLeft: theme.spacing(9) + 1,
      width: `calc(100% - ${theme.spacing(9) + 1}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    display: "none",
  },
  logoWrapper: {
    display: "flex", // contents is buggy with some major browsers
  },
  logo: {
    width: theme.spacing(3.5),
    margin: theme.spacing(0, 1.75, 0, 0),
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  logoHide: {
    width: 0,
    margin: 0,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerHeader: {
    marginTop: theme.spacing(1),
  },
  swipableDrawer: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(9) + 1,
  },
  toolbar: {
    padding: theme.spacing(0, 0, 0, 2),
    ...theme.mixins.toolbar,
  },
  inline: {
    display: "inline",
  },
  content: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  main: {
    padding: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(2),
    marginTop: "auto",
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
  facebookIcon: {
    verticalAlign: "middle",
    marginLeft: theme.spacing(1),
  },
  sponsorIcon: {
    verticalAlign: "middle",
    height: theme.spacing(6),
  },
}));

function ElevationScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
};

function Dialogs(props) {
  const { dialog, setDialog } = props;

  return useMemo(() => {
    const handleDialogClose = () => {
      setDialog(null);
    };

    return (
      <React.Fragment>
        <Dialog
          open={dialog === "sign-in"}
          onClose={handleDialogClose}
          aria-labelledby="sign-in-dialog"
        >
          <SignInDialog />
        </Dialog>
        <Dialog
          open={dialog === "sign-up"}
          onClose={handleDialogClose}
          aria-labelledby="sign-up-dialog"
        >
          <SignUpDialog />
        </Dialog>
        <Dialog
          open={dialog === "create-post"}
          onClose={handleDialogClose}
          aria-labelledby="create-post-dialog"
        >
          <CreatePostDialog />
        </Dialog>
      </React.Fragment>
    );
  }, [setDialog, dialog]);
}

Dialogs.propTypes = {
  dialog: PropTypes.any,
  setDialog: PropTypes.func.isRequired,
};

const mapDialogsStateToProps = (state) => {
  return { dialog: state.dialog };
};

function mapDialogsDispatchToProps(dispatch) {
  return {
    setDialog: (dialog) => dispatch(setDialog(dialog)),
  };
}

const RootLevelDialogs = connect(
  mapDialogsStateToProps,
  mapDialogsDispatchToProps
)(Dialogs);

function Snackbars(props) {
  const { snackbar, setSnackbar } = props;

  return useMemo(() => {
    const handleSnackbarClose = (event, reason) => {
      if (reason === "clickaway") return;
      setSnackbar(false);
    };

    const processQueue = () => {
      if (snackbar.queue.length > 0) {
        setSnackbar(true, snackbar.queue.shift());
      }
    };

    const handleSnackbarExited = () => {
      processQueue();
    };

    return (
      <Snackbar
        key={snackbar.messageInfo ? snackbar.messageInfo.key : undefined}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        onExited={handleSnackbarExited}
        ContentProps={{
          "aria-describedby": "message-id",
        }}
      >
        <SnackbarContentWrapper
          onClose={handleSnackbarClose}
          variant={
            snackbar.messageInfo ? snackbar.messageInfo.variant : undefined
          }
          message={
            snackbar.messageInfo ? snackbar.messageInfo.message : undefined
          }
          actionLabel={
            snackbar.messageInfo ? snackbar.messageInfo.actionLabel : undefined
          }
          onActionClick={
            snackbar.messageInfo ? snackbar.messageInfo.action : undefined
          }
        />
      </Snackbar>
    );
  }, [setSnackbar, snackbar]);
}

Snackbars.propTypes = {
  snackbar: PropTypes.any,
  setSnackbar: PropTypes.func.isRequired,
};

const mapSnackbarsStateToProps = (state) => {
  return { snackbar: state.snackbar };
};

function mapSnackbarsDispatchToProps(dispatch) {
  return {
    setSnackbar: (show, snackbar) => dispatch(setSnackbar(show, snackbar)),
  };
}

const RootLevelSnackbars = connect(
  mapSnackbarsStateToProps,
  mapSnackbarsDispatchToProps
)(Snackbars);

function DrawerInfo(props) {
  const { user, setUser } = props;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser != "undefined" && storedUser != "null") {
      setUser(JSON.parse(storedUser));
    }

    return () => {
      if (user) localStorage.setItem("user", JSON.stringify(user));
    };
  }, [setUser]);

  return useMemo(() => {
    return (
      <React.Fragment>
        <ListItemAvatar>
          {user && user.photo ? (
            <Avatar alt="user avatar" src={user.photo} />
          ) : (
            <AccountCircleTwoTone fontSize="large" />
          )}
        </ListItemAvatar>
        <ListItemText
          primary="Welcome!"
          secondary={user && user.fullname ? user.fullname : "Anonymous"}
        />
      </React.Fragment>
    );
  }, [user]);
}

DrawerInfo.propTypes = {
  user: PropTypes.any,
  setUser: PropTypes.func.isRequired,
};

const mapDrawerStateToProps = (state) => {
  return { user: state.user };
};

function mapDrawerDispatchToProps(dispatch) {
  return {
    setUser: (user) => dispatch(setUser(user)),
  };
}

const DrawerHeader = connect(
  mapDrawerStateToProps,
  mapDrawerDispatchToProps
)(DrawerInfo);

const accountMenuId = "primary-account-menu";

function MainMenu(props) {
  const {
    user,
    account,
    setMenuAnchor,
    setDialog,
    setUser,
    showSnackbar,
  } = props;

  const isMenuOpen = Boolean(account);

  return useMemo(() => {
    const handleMenuClose = () => {
      setMenuAnchor("account", null);
    };

    const handleAccountClick = () => {
      if (!user) {
        setDialog("sign-in");
      } else {
        localStorage.removeItem("user");
        setUser(null);
        showSnackbar("success", "Signed out");
      }
      handleMenuClose();
    };

    return (
      <Menu
        anchorEl={account}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id={accountMenuId}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleAccountClick}>
          {!user ? "Sign in" : "Sign out"}
        </MenuItem>
      </Menu>
    );
  }, [setMenuAnchor, user, account, isMenuOpen]);
}

const mapMenuStateToProps = (state) => {
  return { user: state.user, account: state.menus.account };
};

function mapMenuDispatchToProps(dispatch) {
  return {
    setUser: (user) => dispatch(setUser(user)),
    setDialog: (dialog) => dispatch(setDialog(dialog)),
    setMenuAnchor: (menu, anchor) => dispatch(setMenuAnchor(menu, anchor)),
    showSnackbar: (variant, message) =>
      dispatch(showSnackbar(variant, message)),
  };
}

const AccountMenu = connect(
  mapMenuStateToProps,
  mapMenuDispatchToProps
)(MainMenu);

const accountMenuStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

function MainMenuTrigger(props) {
  const classes = accountMenuStyles();
  const { user, setMenuAnchor } = props;

  return useMemo(() => {
    const handleMenuOpen = (event) => {
      setMenuAnchor("account", event.currentTarget);
    };

    return (
      <IconButton
        aria-label="account of current user"
        aria-controls={accountMenuId}
        aria-haspopup="true"
        onClick={handleMenuOpen}
        color="inherit"
      >
        {user && user.photo ? (
          <Avatar
            className={classes.avatar}
            alt="user avatar"
            src={user.photo}
          />
        ) : (
          <AccountCircleTwoTone />
        )}
      </IconButton>
    );
  }, [classes, setMenuAnchor, user]);
}

MainMenuTrigger.propTypes = {
  user: PropTypes.any,
  setMenuAnchor: PropTypes.func.isRequired,
};

const mapTriggerStateToProps = (state) => {
  return { user: state.user };
};

function mapTriggerDispatchToProps(dispatch) {
  return {
    setMenuAnchor: (menu, anchor) => dispatch(setMenuAnchor(menu, anchor)),
  };
}

const AccountMenuTrigger = connect(
  mapTriggerStateToProps,
  mapTriggerDispatchToProps
)(MainMenuTrigger);

const drawerItemsStyles = makeStyles((theme) => ({
  listItem: {
    margin: theme.spacing(1),
    width: "auto",
    borderRadius: theme.spacing(1),
  },
}));




const lightTheme = {
  body: '#e2e2e2',
  text: '#363537',
  toggleBorder: '#fff',
  gradient: 'linear-gradient(#39598A, #79D7ED)',
}

const darkTheme = {
  body: '#363537',
  text: '#FAFAFA',
  toggleBorder: '#6B8096',
  gradient: 'linear-gradient(#091236, #1E215D)',
}

// eslint-disable-next-line react/prop-types
const Toggle = ({ theme, toggleTheme }) => {
  const isLight = theme === 'light';

  return (
    <ToggleContainer lightTheme={isLight} onClick={toggleTheme}>
      <img src="https://image.flaticon.com/icons/svg/1164/1164954.svg" width="224" height="224" alt="Sun free icon" title="Sun free icon"/>
      <img src="https://image.flaticon.com/icons/svg/2033/2033921.svg" width="224" height="224" alt="Moon free icon" title="Moon free icon"/>
    </ToggleContainer>
  );
};

const ToggleContainer = styled.button`
  position: relative;
  display: flex;
  justify-content: space-between;
  background-color: white;
  border:none;
  outline:none;
  width: 70px;
  height: 50px;
  margin: 20px auto;
  border-radius: 30px;
  border: 0.5px solid #c2c2c2;
  font-size: 0.5rem;
  padding: 0.5rem;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 30px;
    height: 30px;

    max-width: 2.5rem;
    height: auto;
    transition: all 0.3s linear;

    &:first-child {
      transform: ${({ lightTheme }) => lightTheme ? 'translateY(0)' : 'translateY(100px)'};
    }

    &:nth-child(2) {
      transform: ${({ lightTheme }) => lightTheme ? 'translateY(-100px)' : 'translateY(0)'};
    }
  }
`;

const useDarkMode = () => {
  
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
      window.localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light')
      window.localStorage.setItem('theme', 'light');
    }
  };
  
  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme');

    if (localTheme) {
      setTheme(localTheme);
    } else {
      window.localStorage.setItem('theme', 'light');
    }
  })

  return [theme, toggleTheme]
};
function SWITCHER() {
  const [theme, toggleTheme] = useDarkMode();
  const themeMode = theme === 'light' ? lightTheme : darkTheme;
  
  return (
    <ThemeProvider theme={themeMode}>
      <div>
        <Toggle theme={theme} toggleTheme={toggleTheme} />       
      </div>
    </ThemeProvider>
  );
};


function DrawerItems() {
  const classes = drawerItemsStyles();

  const history = useHistory();

  return useMemo(() => {
    const items = [
      {
        id: "/",
        icon: <HomeIcon />,
        text: "Home",
        selected: true,
        action: () => history.push("/"),
      },
      {
        id: "/profile/",
        icon: <FaceIcon />,
        text: "Profile",
        action: () => history.push("/profile/"),
      },
      {
        id: "/page/",
        icon: <CreateIcon />,
        text: "My Page",
        action: () => history.push("/"),
      },
      {
        id: "/group/",
        icon: <GroupIcon />,
        text: "My Group",
        action: () => history.push("/group/"),
      },
      {
        id: "/chat/",
        icon: <ChatIcon />,
        text: "Chat",
        action: () => history.push("/chat/"),
      },
      {
        id: "/discovery/",
        icon: <EmojiPeopleIcon />,
        text: "Discovery",
        action: () => history.push("/discovery/"),
      },
    ];

    return (
      <List>
        {items.map((item) => (
          <ListItem
            key={item.id}
            className={classes.listItem}
            selected={history.location.pathname === item.id}
            button
            onClick={() => history.push(item.id)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <Divider />



          <SWITCHER />




















        
      </List>
    );
  }, [classes]);
}

export default function MainNav(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [searchFocus, setSearchFocus] = React.useState(false);
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawerOn = () => {
    if (isDesktop) {
      handleDrawerOpen();
    } else {
      handleDrawerToggle();
    }
  };

  const handleDrawerOff = () => {
    if (isDesktop) {
      handleDrawerClose();
    } else {
      handleDrawerToggle();
    }
  };

  const handleSearchFocus = (focused) => () => {
    setSearchFocus(focused);
  };

  const handleProductSelected = () => {
    return;
  };

  const drawer = (
    <React.Fragment>
      <ListItem
        className={classes.drawerHeader}
        ContainerComponent="div"
        alignItems="flex-start"
      >
        <DrawerHeader />
        {(open || mobileOpen) && (
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="close drawer"
              onClick={handleDrawerOff}
            >
              {isDesktop ? (
                theme.direction === "rtl" ? (
                  <KeyboardArrowRightRoundedIcon />
                ) : (
                  <KeyboardArrowLeftRoundedIcon />
                )
              ) : (
                <KeyboardArrowDownRoundedIcon />
              )}
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>
      <Divider variant="middle" />
      <DrawerItems />
    </React.Fragment>
  );

  function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href="/">
          Moria
        </Link>{" "}
        {new Date().getFullYear()}
      </Typography>
    );
  }

  return (
    <React.Fragment>
      <div className={clsx(classes.root, classes.grow)}>
        <ElevationScroll>
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
            color="inherit"
          >
            <Toolbar className={classes.toolbar}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOn}
                edge="start"
                className={clsx({
                  [classes.hide]: open,
                })}
              >
                <MenuIcon />
              </IconButton>
              <Link className={classes.logoWrapper} href="/">
                <img
                  className={clsx(classes.logo, {
                    [classes.logoHide]: searchFocus,
                  })}
                  src={Logo}
                  alt="logo"
                />
              </Link>
              <SearchBar
                id="posts-search"
                placeholder="Search posts"
                onFocus={handleSearchFocus(true)}
                onBlur={handleSearchFocus(false)}
                handleSuggestionSelected={handleProductSelected}
              />
              <AccountMenuTrigger />
            </Toolbar>
          </AppBar>
        </ElevationScroll>
        <AccountMenu />
        <nav aria-label="site pages">
          <Hidden smUp implementation="css">
            <SwipeableDrawer
              anchor="bottom"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              PaperProps={{
                square: false,
              }}
              classes={{
                paper: classes.swipableDrawer,
              }}
              disableBackdropTransition={!iOS}
              disableSwipeToOpen={false}
              onOpen={handleDrawerToggle}
            >
              {drawer}
            </SwipeableDrawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              variant="permanent"
              className={clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              })}
              classes={{
                paper: clsx({
                  [classes.drawerOpen]: open,
                  [classes.drawerClose]: !open,
                }),
              }}
              open={open}
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <div className={classes.content}>
          <div className={classes.toolbar} />
          <Container className={classes.main} component="main" maxWidth="md">
            {props.children}
          </Container>
          <footer className={classes.footer}>
            <Copyright />
          </footer>
        </div>
      </div>
      <RootLevelDialogs />
      <RootLevelSnackbars />
    </React.Fragment>
  );
}

MainNav.propTypes = {
  children: PropTypes.node.isRequired,
};
