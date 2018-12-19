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
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import axios from "axios";
import { FormErrors } from "./FormErrors";
import "./style.scss";
import API_K from "./../../keys";

const APPLICATION_ID = "C499EC1A-F6D2-77C2-FFCF-14A634B64900";
const API_KEY = API_K;
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

class Login extends Component {
  state = {
    openLogin: false,
    openRegister: false,
    username: "",
    password: "",
    formErrors: {
      registerEmail: "",
      registerPassword: "",
      registerName: ""
    },
    loginErrors: {
      username: "",
      password: ""
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

  handleClose = x => {
    if (x === 0) this.setState({ openLogin: false, openRegister: false });
    else this.setState({ openRegister: false, openLogin: false });
  };

  loginBackendless = () => {
    const username = this.state.username;
    const password = this.state.password;
    const self = this;
    let loginValidationErrors = this.state.loginErrors;
    let filled = true;
    const str = " cannot be empty";
    if (password.length === 0) {
      loginValidationErrors.password = str;
      filled = false;
    } else {
      loginValidationErrors.password = "";
    }
    if (username.length === 0) {
      loginValidationErrors.username = str;
      filled = false;
    } else {
      loginValidationErrors.username = "";
    }

    this.setState({
      loginErrors: loginValidationErrors
    });

    if (filled) {
      const jsonData = { login: username, password: password };
      axios
        .post(serverURL + "users/login", jsonData)
        .then(function(response) {
          console.log("Login", response);
          self.props.onInit(response.data);
          self.setState({ loggedin: true });
          self.handleClose();
        })
        .catch(function(error) {
          loginValidationErrors.password = "";

          loginValidationErrors.username = " or password is invalid";

          self.setState({
            loginErrors: loginValidationErrors
          });
          console.log("Error", error.message);
        });
    }
  };

  loginChange = e => {
    const id = e.target.id;
    const value = e.target.value;
    this.setState({ [id]: value });
  };

  registerChange = e => {
    const id = e.target.id;
    const value = e.target.value;
    this.setState({ [id]: value }, () => {
      this.validateField(id, value);
    });
  };

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;
    let nameValid = this.state.nameValid;

    switch (fieldName) {
      case "registerEmail":
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? "" : " is invalid";
        break;
      case "registerPassword":
        if (value.length >= 6 && value.length < 12) {
          const re = new RegExp(
            "^(?=.*d)(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.[!@#$%^&]).{6,12}$"
          );
          passwordValid = re.test(value);
          fieldValidationErrors.password = passwordValid
            ? ""
            : " Does not contain Capitals or special charictars, if you use a passphrase (12+ chars) there are no specifications";
        } else if (value.length >= 12) {
          passwordValid = true;
          fieldValidationErrors.password = "";
        } else {
          passwordValid = false;
          fieldValidationErrors.password = " is too short";
        }
        break;
      case "registerName":
        nameValid = true;
        fieldValidationErrors.name = "";
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        emailValid: emailValid,
        passwordValid: passwordValid,
        nameValid: nameValid
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid:
        this.state.emailValid &&
        this.state.passwordValid &&
        this.state.nameValid
    });
  }

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
        <MenuItem onClick={this.handleMenuClose}>Buyer Profile</MenuItem>
        <MenuItem onClick={this.handleMenuClose}>Seller Profile</MenuItem>
        <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
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
        <MenuItem>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
        {/* <MenuItem>
          <IconButton color="inherit">
            <Badge badgeContent={11} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem> */}
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton color="inherit">
            <AccountCircle />
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
              <IconButton
                className={classes.menuButton}
                color="inherit"
                aria-label="Open drawer"
              >
                <MenuIcon />
              </IconButton>
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
              <Button
                className="m-2"
                hidden={!this.state.loggedin}
                variant="contained"
                color="secondary"
                onClick={() => this.handleClick(2)}
              >
                LogOut
              </Button>
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

              <Dialog
                open={this.state.openLogin}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Login</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Something should probably go here, tag line maybe?
                  </DialogContentText>

                  <div className="panel panel-default warning">
                    <FormErrors formErrors={this.state.loginErrors} />
                  </div>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="username"
                    label="Username"
                    type="username"
                    onChange={this.loginChange}
                    required={true}
                    fullWidth
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="password"
                    label="Password"
                    type="password"
                    onChange={this.loginChange}
                    required={true}
                    fullWidth
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    hidden={this.state.loggedin}
                    variant="contained"
                    color="primary"
                    onClick={() => this.handleClick(1)}
                  >
                    Register
                  </Button>
                  <Button onClick={this.loginBackendless} color="primary">
                    Login
                  </Button>
                  <Button onClick={this.handleClose} color="secondary">
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog
                open={this.state.openRegister}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Register</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please consider using a spam email service such as
                    <Button
                      variant="contained"
                      href="https://10minutemail.com"
                      target="_blank"
                      className="m-2"
                    >
                      10 Minute Mail
                    </Button>
                    <br />
                    For the purposes of Account recovery, just remember specific
                    account details
                  </DialogContentText>

                  <div className="panel panel-default warning">
                    <FormErrors formErrors={this.state.formErrors} />
                  </div>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="registerEmail"
                    label="Email Address"
                    type="email"
                    required={true}
                    fullWidth
                    onChange={this.registerChange}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="registerName"
                    label="UserName"
                    type="username"
                    fullWidth
                    required={true}
                    onChange={this.registerChange}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="registerPassword"
                    label="Password"
                    type="password"
                    required={true}
                    fullWidth
                    onChange={this.registerChange}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => this.handleClick(0)}
                  >
                    Login
                  </Button>
                  <Button
                    hidden={this.state.loggedin}
                    onClick={this.handleRegister}
                    color="primary"
                  >
                    Register
                  </Button>
                  <Button onClick={this.handleClose} color="secondary">
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>

              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                <IconButton color="inherit">
                  <Badge badgeContent={-10} color="secondary">
                    <MailIcon />
                  </Badge>
                </IconButton>
                {/* <IconButton color="inherit">
                  <Badge badgeContent={-17} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton> */}
                <IconButton
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

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Login);
