import React, { Component } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { withStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
// import NotificationsIcon from "@material-ui/icons/Notifications";
import Home from "@material-ui/icons/Home";
import MoreIcon from "@material-ui/icons/MoreVert";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Backendless from "backendless";
import qs from "qs";
import TermsOfService from "./termsOfService";
import { NavLink } from "react-router-dom";
import UserAuth from "./userAuth";

import axios from "axios";
import { FormErrors } from "./FormErrors";
import "./style.scss";
import API_K from "../../keys";

const APPLICATION_ID = "C499EC1A-F6D2-77C2-FFCF-14A634B64900";
const API_KEY = API_K[0];
// const JS_KEY = API_K[1];
const serverURL =
  "https://api.backendless.com/" + APPLICATION_ID + "/" + API_KEY + "/";
const styles = theme => ({
  root: {
    width: "100%"
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing.unit * 3,
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200
    }
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  }
});

class NavBar extends Component {
  state = {
    tos: false,
    disabled: false,
    openLogin: false,
    openRegister: false,
    username: "",
    password: "",
    formErrors: {
      email: "",
      password: "",
      name: "",
      registrationError: ""
    },
    loginErrors: {
      username: "",
      password: "",
      loginError: ""
    },
    registerName: "",
    registerPassword: "",
    registerEmail: "",
    emailValid: false,
    passwordValid: false,
    nameValid: false,
    formValid: false,
    loggedin: false,
    anchorEl: null,
    mobileMoreAnchorEl: null
  };

  handleClick = x => {
    if (x === 0) {
      this.setState({ openLogin: true, openRegister: false });
    } else if (x === 1) {
      this.setState({ openRegister: true, openLogin: false });
    } else {
      const self = this;
      const userAuthToken = self.props.getAuth();
      axios
        .get(serverURL + "users/logout", {
          headers: { "user-token": userAuthToken }
        })
        .then(response => {
          // If request is good...
          console.log("Logout", response.data);

          self.setState({ loggedin: false });
          window.location.reload();
        })
        .catch(error => {
          console.log("error " + error);
        });
    }
  };

  handleClose = () => {
    this.setState({ openLogin: false, openRegister: false });
  };

  errorClass(error) {
    return error.length === 0 ? "" : "has-error";
  }

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  render() {
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const { classes } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={() => this.handleMenuClose()}>
          Buyer Profile
        </MenuItem>
        <NavLink to="/sellerProfile">
          <MenuItem onClick={() => this.handleMenuClose()}>
            Seller Profile
          </MenuItem>
        </NavLink>
        <MenuItem onClick={() => this.handleMenuClose()}>My account</MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <NavLink to="/mailBox">
          <MenuItem>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <p>Messages</p>
          </MenuItem>
        </NavLink>
        <NavLink to="/">
          <MenuItem>
            <IconButton color="inherit">
              <Home />
            </IconButton>
            <p>HomePage</p>
          </MenuItem>
        </NavLink>
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton color="inherit">
            <AccountCircle onClick={this.handleProfileMenuOpen} />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );

    return (
      <span>
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              {/* <IconButton
                className={classes.menuButton}
                color="inherit"
                aria-label="Open drawer"
              >
                <MenuIcon />
              </IconButton> */}
              <Typography
                className={classes.title}
                variant="h4"
                color="inherit"
                noWrap
              >
                HalfNHalf
              </Typography>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search Our Stores…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput
                  }}
                />
              </div>

              <NavLink to="/">
                <Button
                  className="m-2"
                  hidden={!this.state.loggedin}
                  variant="contained"
                  color="secondary"
                  onClick={() => this.handleClick(2)}
                >
                  LogOut
                </Button>
              </NavLink>
              <Button
                className="m-2"
                hidden={this.state.loggedin}
                variant="contained"
                color="primary"
                onClick={() => this.handleClick(0)}
              >
                Login
              </Button>
              <Button
                hidden={this.state.loggedin}
                variant="contained"
                color="primary"
                onClick={() => this.handleClick(1)}
              >
                Register
              </Button>

              <UserAuth
                onInit={this.props.onInit}
                onMessageInit={this.props.onMessageInit}
                onStoreInit={this.props.onStoreInit}
                getAuth={this.props.getAuth}
                getUser={this.props.getUser}
                ip={this.props.ip}
                openLogin={this.state.openLogin}
                openRegister={this.state.openRegister}
                openTos={this.state.tos}
                loggedIn={() => {
                  this.setState({ loggedin: true });
                }}
                handleClose={this.handleClose}
                declined={() => {
                  this.setState({ tos: false });
                }}
              />

              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                <IconButton hidden={!this.state.loggedin} color="primary">
                  <NavLink to="/">
                    <Home />
                  </NavLink>
                </IconButton>
                <IconButton hidden={!this.state.loggedin} color="primary">
                  <Badge badgeContent={-10} color="secondary">
                    <NavLink to="/mailBox">
                      <MailIcon />
                    </NavLink>
                  </Badge>
                </IconButton>
                {/* <IconButton color="inherit">
                  <Badge badgeContent={-17} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton> */}
                <IconButton
                  hidden={!this.state.loggedin}
                  aria-owns={isMenuOpen ? "material-appbar" : undefined}
                  aria-haspopup="true"
                  onClick={this.handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </div>
              <div className={classes.sectionMobile}>
                <IconButton
                  hidden={!this.state.loggedin}
                  aria-haspopup="true"
                  onClick={this.handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>
          {renderMenu}
          {renderMobileMenu}
        </div>
      </span>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NavBar);
