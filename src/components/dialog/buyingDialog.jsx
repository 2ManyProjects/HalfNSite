import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { FormErrors } from "./FormErrors";
import axios from "axios";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import Slider from "@material-ui/lab/Slider";
import Backendless from "backendless";
import API_K from "./../../keys";
const styles = {
  root: {
    width: 300
  },
  slider: {
    padding: "22px 0px"
  }
};

class buyingDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.show,
      storeName: "",
      profile: {},
      userData: {},
      content: "",
      anchorEl: null,
      selectedDeal: {},
      email: { amnt: 1, link: "", txt: "" },
      disabled: true,
      Errors: {
        txt: ""
      }
    };
  }

  handleCloseMail = () => {
    this.setState({
      open: false,
      storeName: "",
      profile: {},
      userData: {},
      content: "",
      anchorEl: null,
      selectedDeal: {},
      email: { amnt: 1, link: "", txt: "" },
      disabled: true,
      Errors: {
        txt: ""
      }
    });
    this.props.close();
  };

  componentWillReceiveProps(props) {
    if (props.profile.name !== undefined) {
      this.setState(
        {
          open: props.show,
          profile: props.profile,
          storeName: props.storeName
        },
        () => {
          this.fillData();
        }
      );
    }
  }

  fillData = () => {
    axios.get(this.state.profile.profile).then(profileData => {
      let tempData = {};
      for (let x = 0; x < profileData.data.length; x++) {
        if (profileData.data[x].name.includes(this.state.storeName)) {
          tempData = profileData.data[x];
          break;
        }
      }
      this.setState(
        {
          userData: tempData
        },
        () => {
          this.renderMenu();
        }
      );
    });
  };
  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = deal => {
    this.setState({ selectedDeal: deal, anchorEl: null });
  };

  renderMenu = () => {
    let content = this.state.userData.storeDeals.map((deal, index) => {
      if (deal.currentAmnt === 0) return <div hidden={true} />;
      return (
        <MenuItem
          onClick={() => {
            this.handleClose(deal);
          }}
          key={index}
        >
          {" "}
          {deal.rate}%
        </MenuItem>
      );
    });

    this.setState({ content: content });
  };

  getDealSelection = () => {
    if (this.state.selectedDeal.rate === undefined) {
      return "Select Deal";
    } else {
      return this.state.selectedDeal.rate + "% " + this.state.selectedDeal.id;
    }
  };

  generateGuid = () => {
    var result, i, j;
    result = "";
    for (j = 0; j < 32; j++) {
      if (j === 8 || j === 12 || j === 16 || j === 20) result = result + "-";
      i = Math.floor(Math.random() * 16)
        .toString(16)
        .toUpperCase();
      result = result + i;
    }
    return result;
  };

  valChange = e => {
    let value = e.target.value;
    if (e.target.id === "link") {
      this.setState({
        email: {
          link: value,
          txt: this.state.email.txt,
          amnt: this.state.email.amnt
        }
      });
    } else {
      this.setState(
        {
          email: {
            txt: value,
            amnt: this.state.email.amnt,
            link: this.state.email.link
          }
        },
        () => {
          this.validateField();
        }
      );
    }
  };

  handleChange = (event, value) => {
    this.setState({
      email: {
        amnt: value,
        link: this.state.email.link,
        txt: this.state.email.txt
      }
    });
  };

  validateField() {
    let fieldErrors = this.state.Errors;

    if (this.state.email.txt.length < 5) {
      fieldErrors.txt = " Please Specify your order details";
    } else {
      fieldErrors.txt = "";
    }
    this.setState(
      {
        Errors: fieldErrors
      },
      () => {
        this.validateErrors();
      }
    );
  }
  validateErrors = () => {
    const val =
      this.state.selectedDeal.rate === undefined ||
      this.state.email.txt.length < 5;
    this.setState({ disabled: val });
  };

  handleSendMail = () => {
    const id = this.generateGuid();
    const self = this;
    let deal = this.state.selectedDeal;
    deal.selectedAmnt = this.state.email.amnt;
    const email = {
      id: id,
      from: this.props.getUser.name,
      to: this.state.userData.seller,
      storeName: this.state.storeName,
      selectedDeal: this.state.selectedDeal,
      subject: this.state.email.amnt + " of " + this.state.email.link,
      content: this.state.email.txt,
      seen: false,
      completed: false,
      reply: []
    };
    // const jsonData = {
    //   subject: "New Order",
    //   bodyparts: {
    //     textmessage: JSON.stringify(email)
    //   },
    //   to: ["hello.half.n.half@gmail.com"]
    // };

    // axios
    //   .post(this.props.emailLink, jsonData)
    //   .then(function(response) {
    //     console.log("Sent", response);
    //   })
    //   .catch(function(error) {
    //     console.log("Error", error);
    //   });

    axios
      .get(this.props.getMessage.buyingEmails)
      .then(function(response) {
        let emailList = response.data;
        emailList.push(email);
        const path = "profileData/" + self.props.getUser.objectId + "/";
        const emails = new Blob([JSON.stringify(emailList)], {
          type: "application/json"
        });
        Backendless.Files.saveFile(path, "buyingemails.txt", emails, true)
          .then(function(fileURL) {
            axios
              .get(API_K[3] + "buyingemails.txt")
              .then(function(response) {
                let adminEmailList = response.data;
                adminEmailList.push(email);
                const filePath = "profileData/" + API_K[4] + "/";
                const adminEmails = new Blob([JSON.stringify(adminEmailList)], {
                  type: "application/json"
                });
                Backendless.Files.saveFile(
                  filePath,
                  "buyingemails.txt",
                  adminEmails,
                  true
                )
                  .then(function(fileURL) {})
                  .catch(function(error) {});
              })
              .catch(function(error) {
                console.log("Error", error);
              });
          })
          .catch(function(error) {});
      })
      .catch(function(error) {
        console.log("Error", error);
      });

    this.setState(
      {
        open: false,
        storeName: "",
        profile: {},
        userData: {},
        content: "",
        anchorEl: null,
        selectedDeal: {},
        email: { amnt: 1, link: "", txt: "" },
        disabled: true,
        Errors: {
          txt: ""
        }
      },
      () => {
        this.props.close();
      }
    );
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleCloseMail}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">Send an Inquiry</DialogTitle>
          <DialogContent>
            <Typography align="center" variant="h4" gutterBottom>
              {this.state.storeName}
            </Typography>
            <center>
              <Button
                variant="contained"
                aria-owns={open ? "fade-menu" : undefined}
                aria-haspopup="true"
                onClick={this.handleClick}
              >
                {this.getDealSelection()}
              </Button>
              <Menu
                id="fade-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={this.handleClose}
                TransitionComponent={Fade}
              >
                {this.state.content}
              </Menu>
            </center>
            <div hidden={this.state.selectedDeal.rate === undefined}>
              <div className="panel panel-default warning">
                <FormErrors formErrors={this.state.Errors} />
              </div>
              <Slider
                classes={{ container: classes.slider }}
                value={this.state.email.amnt}
                required={true}
                min={1}
                max={parseInt(this.state.selectedDeal.currentAmnt)}
                step={1}
                id="Amnt"
                onChange={this.handleChange}
              />
              <Typography id="label">
                {this.state.email.amnt}/{this.state.selectedDeal.currentAmnt}
              </Typography>
              <TextField
                margin="dense"
                id="link"
                label="Product Link (Not Required)"
                type="url"
                onChange={this.valChange}
                multiline={true}
                required={false}
                fullWidth
              />
              <TextField
                margin="dense"
                id="text"
                label="Details"
                type="text"
                onChange={this.valChange}
                required={true}
                multiline={true}
                inputProps={{ maxLength: 400 }}
                fullWidth
              />
              <Typography id="label">
                {this.state.email.txt.length}/400
              </Typography>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseMail} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.disabled}
              onClick={this.handleSendMail}
              color="primary"
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
buyingDialog.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(buyingDialog);
