import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AccountCircleTwoTone from "@material-ui/icons/AccountCircleTwoTone";
import Avatar from "@material-ui/core/Avatar";
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import CreateIcon from "@material-ui/icons/Create";
import CreatePostDialog from "../dialogs/CreatePostDialog";
import Dialog from "@material-ui/core/Dialog";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import ForumIcon from "@material-ui/icons/Forum";
import Hidden from "@material-ui/core/Hidden";
import HomeIcon from "@material-ui/icons/Home";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
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

import { useStateValue } from "../state/store";
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

function RootLevelDialogs() {
  const [{ dialog }, dispatch] = useStateValue();

  return useMemo(() => {
    const handleDialogClose = () => {
      dispatch(setDialog(null));
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
  }, [dispatch, dialog]);
}

function RootLevelSnackbar() {
  const [{ snackbar }, dispatch] = useStateValue();

  return useMemo(() => {
    const handleSnackbarClose = (event, reason) => {
      if (reason === "clickaway") return;
      dispatch(setSnackbar(false));
    };

    const processQueue = () => {
      if (snackbar.queue.length > 0) {
        dispatch(setSnackbar(true, snackbar.queue.shift()));
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
  }, [dispatch, snackbar]);
}

function DrawerHeader() {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser !== null) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

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

const accountMenuId = "primary-account-menu";

function AccountMenu() {
  const [
    {
      user,
      menus: { account },
    },
    dispatch,
  ] = useStateValue();

  const isMenuOpen = Boolean(account);

  return useMemo(() => {
    const handleMenuClose = () => {
      dispatch(setMenuAnchor("account", null));
    };

    const handleAccountClick = () => {
      if (!user) {
        dispatch(setDialog("sign-in"));
      } else {
        localStorage.removeItem("user");
        dispatch(setUser(null));
        dispatch(showSnackbar("success", "Signed out"));
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
  }, [dispatch, user, account, isMenuOpen]);
}

const accountMenuStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

function AccountMenuTrigger() {
  const classes = accountMenuStyles();
  const [{ user }, dispatch] = useStateValue();

  return useMemo(() => {
    const handleMenuOpen = (event) => {
      dispatch(setMenuAnchor("account", event.currentTarget));
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
  }, [classes, dispatch, user]);
}

const drawerItemsStyles = makeStyles((theme) => ({
  listItem: {
    margin: theme.spacing(1),
    width: "auto",
    borderRadius: theme.spacing(1),
  },
}));

function DrawerItems() {
  const classes = drawerItemsStyles();

  return useMemo(() => {
    const items = [
      {
        icon: <HomeIcon />,
        text: "Home",
        selected: true,
      },
      {
        icon: <CreateIcon />,
        text: "My Page",
      },
      {
        icon: <ForumIcon />,
        text: "My Groups",
      },
      {
        icon: <InfoIcon />,
        text: "About Us",
      },
    ];

    return (
      <List>
        {items.map((item) => (
          <ListItem
            key={item.text}
            className={classes.listItem}
            selected={item.selected}
            button
            onClick={item.action}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <Divider />
        <FormControlLabel
          style={{ marginLeft: "7px", marginTop: "10px" }}
          value="top"
          control={
            <Switch
              color="primary"
              checked={isItDark}
              onChange={() => {
                isItDark ^= 1;
                console.log(isItDark);
              }}
            />
          }
          label="Dark"
          labelPlacement="top"
        />
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
          <Container className={classes.main} component="main" maxWidth="lg">
            {props.children}
          </Container>
          <footer className={classes.footer}>
            <Copyright />
          </footer>
        </div>
      </div>
      <RootLevelDialogs />
      <RootLevelSnackbar />
    </React.Fragment>
  );
}

MainNav.propTypes = {
  children: PropTypes.node.isRequired,
};
