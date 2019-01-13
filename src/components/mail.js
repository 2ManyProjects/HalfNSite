import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import red from "@material-ui/core/colors/red";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { FormErrors } from "./dialog/FormErrors";
import axios from "axios";
import Backendless from "backendless";
import PassThrough from "./dialog/passthrough";
import API_K from "./../keys";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 800
  },
  card: {
    maxWidth: 700
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  }
});

class Mail extends React.Component {
  state = {
    expanded: false,
    show: false,
    expandable: false,
    reply: false,
    open: false,
    email: {},
    text: "",
    disabled: true,
    Errors: {
      message: ""
    }
  };
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  isExpandable = () => {
    if (this.props.reply !== undefined) {
      let expand = false;
      if (this.props.reply.props.children[1].length > 0) {
        expand = true;
      }
      this.setState({ expandable: expand, reply: true });
    } else {
      this.setState({ expandable: false });
    }
  };

  valChange = e => {
    let value = e.target.value;
    this.setState(
      {
        text: value
      },
      () => this.validateChange()
    );
  };

  sendMail = () => {
    const self = this;
    let mailTo = "";
    let record;
    let emailLink;
    if (this.props.folder === "Seller") {
      record = "sellingemails.txt";
      emailLink = this.props.getMessage.sellingEmails;
    } else if (this.props.folder === "Buyer") {
      record = "buyingemails.txt";
      emailLink = this.props.getMessage.buyingEmails;
    }
    if (this.props.getName === "Admin") {
      if (record === "sellingemails.txt") {
        mailTo = this.props.to;
      } else {
        mailTo = this.props.from;
      }
    } else {
      mailTo = "Admin";
    }

    const email = {
      from: this.props.getName,
      to: mailTo,
      content: this.state.text,
      seen: false
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
      .get(emailLink)
      .then(function(response) {
        let emailList = response.data;
        let id = self.props.id;
        for (let x = 0; x < emailList.length; x++) {
          if (emailList[x].id === id) {
            let replies = emailList[x].reply;
            replies.push(email);
            emailList[x].reply = replies;
          }
        }
        const path = "profileData/" + self.props.objectId + "/";
        const emails = new Blob([JSON.stringify(emailList)], {
          type: "application/json"
        });
        Backendless.Files.saveFile(path, record, emails, true)
          .then(function(fileURL) {
            if (emailLink === API_K[3] + record) {
              const whereClause = "name = '" + self.props.from + "'";
              const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(
                whereClause
              );
              Backendless.Data.of("Messaging")
                .find(queryBuilder)
                .then(function(foundUser) {
                  let link = "";
                  if (record === "sellingemails.txt") {
                    link = foundUser[0].sellingEmails;
                  } else {
                    link = foundUser[0].buyingEmails;
                  }
                  axios
                    .get(link)
                    .then(function(result) {
                      let otherEmailList = result.data;
                      console.log("Other Emailer", result.data);
                      for (let x = 0; x < otherEmailList.length; x++) {
                        if (otherEmailList[x].id === id) {
                          let replies = otherEmailList[x].reply;
                          replies.push(email);
                          otherEmailList[x].reply = replies;
                        }
                      }
                      const filePath =
                        "profileData/" + foundUser[0].userID + "/";
                      const otherEmails = new Blob(
                        [JSON.stringify(otherEmailList)],
                        {
                          type: "application/json"
                        }
                      );
                      Backendless.Files.saveFile(
                        filePath,
                        record,
                        otherEmails,
                        true
                      )
                        .then(function(fileURL) {})
                        .catch(function(error) {});
                    })
                    .catch(function(error) {
                      console.log("Error", error);
                    });
                })
                .catch(function(fault) {});
            } else {
              axios
                .get(API_K[3] + record)
                .then(function(result) {
                  let otherEmailList = result.data;
                  for (let x = 0; x < emailList.length; x++) {
                    if (otherEmailList[x].id === id) {
                      let replies = otherEmailList[x].reply;
                      replies.push(email);
                      otherEmailList[x].reply = replies;
                    }
                  }
                  const filePath = "profileData/" + API_K[4] + "/";
                  const otherEmails = new Blob(
                    [JSON.stringify(otherEmailList)],
                    {
                      type: "application/json"
                    }
                  );
                  Backendless.Files.saveFile(
                    filePath,
                    record,
                    otherEmails,
                    true
                  )
                    .then(function(fileURL) {})
                    .catch(function(error) {});
                })
                .catch(function(error) {
                  console.log("Error", error);
                });
            }
          })
          .catch(function(error) {});
      })
      .catch(function(error) {
        console.log("Error", error);
      });

    this.setState(
      {
        open: false,
        text: "",
        Errors: {
          message: ""
        }
      },
      () => {
        this.handleClose();
      }
    );
  };

  validateChange = () => {
    // console.log("Text", this.state.text, this.state.text.length < 2);
    let Err = this.state.Errors;
    if (this.state.text.length === 0) {
      Err.message = "cannot be empty";
    } else {
      Err.message = "";
    }
    this.setState({ Errors: Err }, () => {
      this.validateErrors();
    });
  };

  isAdmin = () => {
    if (!this.state.reply) return true;
    else if (this.props.getName !== "Admin") return true;
    else return false;
  };

  validateErrors = () => {
    const val = this.state.Errors.message.length > 0;
    this.setState({ disabled: val });
  };

  componentDidMount() {
    this.isExpandable();
  }

  getName() {
    if (this.props.to !== this.props.getName) return this.props.to;
    else return this.props.from;
  }

  componentDidUpdate() {}

  openDialog = () => {
    this.setState({ show: true, mail: this.props.mail });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Card className={classes.card}>
          <CardHeader
            title={
              <div>
                From: {this.props.from}
                <br /> <div>To: {this.props.to}</div>
              </div>
            }
            subheader={<div>Subject: {this.props.subject}</div>}
          />
          <CardContent>
            <CardContent>{this.props.content}</CardContent>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: this.state.expanded
              })}
              hidden={!this.state.expandable}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="Show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>{this.props.reply}</CardContent>
          </Collapse>

          <Button
            hidden={!this.state.reply}
            className="m-2"
            variant="contained"
            color="secondary"
            onClick={this.handleClickOpen}
          >
            Reply
          </Button>

          <Button
            hidden={this.isAdmin()}
            className="m-2"
            variant="contained"
            color="secondary"
            onClick={this.openDialog}
          >
            Pass Through
          </Button>
          <PassThrough
            getMessage={this.props.getMessage}
            mail={this.state.mail}
            show={this.state.show}
            folder={this.props.folder}
            objectId={this.props.objectId}
            close={() => {
              this.setState({ show: false, email: {} });
            }}
          />
        </Card>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">
            Email to: {this.getName()}
          </DialogTitle>
          <div className="panel panel-default warning">
            <FormErrors formErrors={this.state.Errors} />
          </div>
          <DialogContent>
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
            {this.state.text.length}/400
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.disabled}
              onClick={this.sendMail}
              color="primary"
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>
        <br />
      </div>
    );
  }
}

Mail.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Mail);
