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
import {NavLink} from "react-router-dom";

import axios from "axios";
import { FormErrors } from "./FormErrors";
import "./style.scss";
import API_K from "./../../keys";

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

class Login extends Component {
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

  handleClose = x => {
    if (x === 0) this.setState({ openLogin: false, openRegister: false });
    else this.setState({ openRegister: false, openLogin: false });
  };

  //have the TOS popup here, proceed only if accepted
  handleRegister = () => {
    const self = this;
    this.setState(
      {
        disabled: true,
        tos: false
      },
      () => {
        let formErrors = this.state.formErrors;
        const username = this.state.registerName;
        const password = this.state.registerPassword;
        const email = this.state.registerEmail;
        const profileData = username + "#" + email + "#0#0#";

        const jsonData = {
          email: email,
          name: username,
          password: password,
          profileData: profileData
        };
        axios
          .post(serverURL + "users/register", jsonData)
          .then(function(response) {
            console.log("Register", response.data);
            self.setState({ openRegister: false, openLogin: true });
            const objID = response.data.objectId;
            const msging = {
              name: username,
              userID: objID
            };
            axios
              .post(serverURL + "data/Messaging", msging)
              .then(function(response) {
                console.log("Messaging", response.data);
                self.setState({disabled: false});
              })
              .catch(function(error) {
                console.log("Error", error.message);
              });
          })
          .catch(function(error) {
            formErrors.password = "";
            formErrors.email = "";
            formErrors.username = "";

            formErrors.registrationError = error.message;

            self.setState({
              formErrors: formErrors
            });
            console.log("Error", error);
            self.setState({disabled: false});
          });
      }
    );
  };

  setupFiles = () => {
    const self = this;

    const emptyData = new Blob([JSON.stringify([])], {
      type: "application/json"
    });
    let profileDatalink = "";
    let sellingDatalink = "";
    let sellingHistorylink = "";
    let buyingDatalink = "";
    let buyingHistorylink = "";
    let buyingemailslink = "";
    let sellingemailslink = "";
    const path = "profileData/" + self.props.getUser().objectId;
    if (this.props.getUser().profile === null) {
      const jsonData = {
        country: "CA",
        type: "custom",
        business_type: "individual",
        email: self.props.getUser().email, 
        default_currency: "cad",
        tos_acceptance: {
          date: Math.trunc(this.props.getUser().created / 1000), 
          ip: this.props.ip,
        }
      }
      console.log(" QUERY " + qs.stringify(jsonData));
      // { email: self.props.getUser().email, date: Math.trunc(this.props.getUser().created / 1000), ip: this.props.ip }
      axios
        .post(
          "https://api.backendless.com/C499EC1A-F6D2-77C2-FFCF-14A634B64900/9EB16649-E4D8-8EAC-FFF8-6B8CE47C7600/services/MyService/initStripe",
          jsonData,
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(function(response) {
          console.log("Response", response);
          console.log("Response", response.data.data.id);
          self.props.getUser().StripeID = response.data.data.id;
          Backendless.UserService.update(self.props.getUser())
            .then(function(updatedUser) {})
            .catch(function(error) {});
        })
        .catch(function(error) {
          console.log("Error", error);
        });
      Backendless.Files.saveFile(path, "profileData.txt", emptyData, true)
        .then(function(response) {
          profileDatalink = response;
          Backendless.Files.saveFile(path, "sellingData.txt", emptyData, true)
            .then(function(response) {
              sellingDatalink = response;
              Backendless.Files.saveFile(
                path,
                "sellingHistory.txt",
                emptyData,
                true
              )
                .then(function(response) {
                  sellingHistorylink = response;
                  Backendless.Files.saveFile(
                    path,
                    "buyingData.txt",
                    emptyData,
                    true
                  )
                    .then(function(response) {
                      buyingDatalink = response;
                      Backendless.Files.saveFile(
                        path,
                        "buyingHistory.txt",
                        emptyData,
                        true
                      )
                        .then(function(response) {
                          buyingHistorylink = response;
                          Backendless.Files.saveFile(
                            path,
                            "buyingemails.txt",
                            emptyData,
                            true
                          )
                            .then(function(response) {
                              buyingemailslink = response;
                              Backendless.Files.saveFile(
                                path,
                                "sellingemails.txt",
                                emptyData,
                                true
                              )
                                .then(function(response) {
                                  sellingemailslink = response;
                                  self.props.getUser().profile =
                                    profileDatalink.fileURL;
                                  Backendless.UserService.update(
                                    self.props.getUser()
                                  )
                                    .then(function(response) {
                                      var whereClause =
                                        "name = '" +
                                        self.props.getUser().name +
                                        "'";
                                      var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(
                                        whereClause
                                      );
                                      Backendless.Data.of("Messaging")
                                        .find(queryBuilder)
                                        .then(function(result) {
                                          let updatedMessage = result[0];
                                          updatedMessage.buyingEmails =
                                            buyingemailslink.fileURL;
                                          updatedMessage.buyingDataGson =
                                            buyingDatalink.fileURL;
                                          updatedMessage.buyingDataGsonHistory =
                                            buyingHistorylink.fileURL;
                                          updatedMessage.sellingDataGson =
                                            sellingDatalink.fileURL;
                                          updatedMessage.sellingDataGsonHistory =
                                            sellingHistorylink.fileURL;
                                          updatedMessage.sellingEmails =
                                            sellingemailslink.fileURL;
                                          Backendless.Data.of("Messaging")
                                            .save(updatedMessage)
                                            .then(function(response) {
                                              self.props.getUser().messageID =
                                                updatedMessage.objectId;
                                              Backendless.UserService.update(
                                                self.props.getUser()
                                              )
                                                .then(function(response) {
                                                  axios
                                                    .get(
                                                      self.props.getUser()
                                                        .profile
                                                    )
                                                    .then(function(response) {
                                                      self.setState({
                                                        disabled: false
                                                      });
                                                      self.props.onStoreInit(
                                                        response.data
                                                      );
                                                    })
                                                    .catch(function(error) {
                                                      console.log(
                                                        "Error",
                                                        error
                                                      );
                                                    });
                                                  self.props.onMessageInit(
                                                    response
                                                  );
                                                })
                                                .catch();
                                            })
                                            .catch();
                                        })
                                        .catch(function(error) {});
                                    })
                                    .catch();
                                })
                                .catch();
                            })
                            .catch();
                        })
                        .catch();
                    })
                    .catch();
                })
                .catch();
            })
            .catch();
        })
        .catch(function(error) {
          console.log("ERROR", error);
        });
    }
  };

  loginBackendless = () => {
    const self = this;
    this.setState(
      {
        disabled: true
      },
      () => {
        const username = self.state.username;
        const password = self.state.password;
        let loginValidationErrors = self.state.loginErrors;
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

        self.setState({
          loginErrors: loginValidationErrors
        });

        if (filled) {
          const jsonData = { login: username, password: password };

          Backendless.UserService.login(jsonData.login, jsonData.password)
            .then(function(response) {
              console.log("Login", response);
              self.props.onInit(response);
              self.setState({ loggedin: true });
              self.handleClose();
              var whereClause = "name = '" + jsonData.login + "'";
              var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(
                whereClause
              );
              Backendless.Data.of("Messaging")
                .find(queryBuilder)
                .then(function(response) {
                  const messageID = response[0].objectId;
                  const messageJson = { messageID: messageID };
                  const objID = self.props.getUser().objectId;
                  axios
                    .put(serverURL + "users/" + objID, messageJson, {
                      headers: { "user-token": self.props.getAuth() }
                    })
                    .then(function(response) {
                      self.setupFiles();
                      if (self.props.getUser().profile !== null) {
                        Backendless.Data.of("Messaging")
                          .findById(messageID)
                          .then(function(result) {
                            self.props.onMessageInit(result);
                          })
                          .catch(function(error) {
                            console.log("Error", error);
                          });
                        axios
                          .get(self.props.getUser().profile)
                          .then(function(response) {
                            self.setState({ disabled: false });
                            self.props.onStoreInit(response.data);
                          })
                          .catch(function(error) {
                            console.log("Error", error);
                          });
                      }
                    })
                    .catch(function(error) {
                      console.log("Error Updating User", error.message);
                    });
                })
                .catch(function(error) {
                  console.log("Error Finding Message", error.message);
                });
            })
            .catch(function(error) {
              self.setState({
                disabled: false
              });
              loginValidationErrors.password = "";

              if (error.message === "Request failed with status code 401") {
                loginValidationErrors.username = " or password is invalid";
                loginValidationErrors.password = "";
                loginValidationErrors.loginError = "";
              }
              if (error.message === "Request failed with status code 400") {
                loginValidationErrors.loginError =
                  " Email has not been verified";
                loginValidationErrors.username = "";
                loginValidationErrors.password = "";
              }
              self.setState({
                loginErrors: loginValidationErrors
              });
            });
        }
      }
    );
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
        if ((value.length >= 6 && value.length < 12) || value.length === 4) {
          const re = new RegExp(
            "^(?=.*d)(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.[!@#$%^&]).{6,12}$"
          );
          passwordValid = re.test(value);
          //TODO: Remove This
          if (value === "test") passwordValid = true;
          //---------------------------------------------------------------------------------//
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
        const re = new RegExp("[^A-Za-z0-9]+");
        nameValid = re.test(value);
        fieldValidationErrors.name = nameValid ? "no special characters" : "";
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
      this.validateForm()
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
        <MenuItem onClick={() => this.handleMenuClose()}>
          Buyer Profile
        </MenuItem>
        <NavLink to="/sellerProfile">
          <MenuItem onClick={() => this.handleMenuClose()}>
            Seller Profile
          </MenuItem>
        </NavLink>
        <MenuItem onClick={() => this.handleMenuClose()}>
          My account
        </MenuItem>
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
              <MailIcon/>
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
                    value={this.state.username}
                    label="Username"
                    type="username"
                    onChange={this.loginChange}
                    required={true}
                    fullWidth
                  />
                  <TextField
                    margin="dense"
                    id="password"
                    value={this.state.password}
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
                  <Button
                    disabled={this.state.disabled}
                    onClick={this.loginBackendless}
                    color="primary"
                  >
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
                    margin="dense"
                    id="registerName"
                    label="UserName"
                    type="username"
                    fullWidth
                    required={true}
                    onChange={this.registerChange}
                  />
                  <TextField
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
                    disabled={
                      !(
                        this.state.formErrors.email.length === 0 &&
                        this.state.formErrors.name.length === 0 &&
                        this.state.formErrors.password.length === 0
                      ) || (
                        this.state.registerName.length === 0 ||
                        this.state.registerEmail.length === 0 ||
                        this.state.registerPassword.length === 0
                      ) || this.state.disabled
                    }
                    hidden={this.state.loggedin}
                    onClick={() => {
                      this.setState({ tos: true});
                    }}
                    color="primary"
                  >
                    Register
                  </Button>
                  <Button onClick={this.handleClose} color="secondary">
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>

              <TermsOfService
                open={this.state.tos}
                accepted={this.handleRegister}
                declined={() => {
                  this.setState({ tos: false});
                }}/>

              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                <IconButton hidden={!this.state.loggedin} color="white">
                  <NavLink to="/">
                    <Home/>
                  </NavLink>
                </IconButton>
                <IconButton hidden={!this.state.loggedin} color="white">
                  <Badge badgeContent={-10} color="secondary">
                    <NavLink to="/mailBox">
                      <MailIcon/>
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

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Login);
