import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import FormLabel from "@material-ui/core/FormLabel";
import Switch from "@material-ui/core/Switch";
import axios from "axios";
import Backendless from "backendless";
class passThrough extends Component {
  constructor(props) {
    super(props);
    this.state = { open: this.props.show, mail: {} };
  }

  componentWillReceiveProps(props) {
    if (props.mail !== undefined) {
      this.setState({
        buying: true,
        open: props.show,
        mail: props.mail,
        text: "",
        to: ""
      });
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };
  valChange = e => {
    let value = e.target.value;
    let id = e.target.id;

    this.setState({
      [id]: value
    });
  };

  handleClose = () => {
    let buying;
    if (this.props.folder === "Seller") {
      buying = false;
    } else if (this.props.folder === "Buyer") {
      buying = true;
    }
    this.setState({
      open: false,
      buying: buying,
      mail: {}
    });
    this.props.close();
  };

  handleSendMail = () => {
    const self = this;
    const messageData = this.props.getMessage;
    const email = {
      from: "Admin",
      to: this.state.to,
      content: this.state.text,
      seen: false
    };
    const newEmail = {
      id: this.props.mail.id,
      from: "Admin",
      to: this.state.to,
      storeName: this.props.mail.storeName,
      selectedDeal: this.props.mail.selectedDeal,
      subject: this.props.mail.amnt + " of " + this.props.mail.link,
      content: this.state.text,
      seen: false,
      completed: false,
      reply: []
    };
    let record;
    let emailLink = "";
    if (this.props.folder === "Seller") {
      record = "sellingemails.txt";
      emailLink = messageData.sellingEmails;
    } else if (this.props.folder === "Buyer") {
      record = "buyingemails.txt";
      emailLink = messageData.buyingEmails;
    }
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
    const whereClause = "name = '" + self.state.to + "'";
    const isBuyer = this.state.buying;
    axios
      .get(emailLink)
      .then(function(response) {
        let emailList = response.data;
        let id = self.props.mail.id;
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
            const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(
              whereClause
            );
            Backendless.Data.of("Messaging")
              .find(queryBuilder)
              .then(function(foundUser) {
                let link = "";
                if (!self.state.buying) {
                  link = foundUser[0].sellingEmails;
                } else {
                  link = foundUser[0].buyingEmails;
                }
                axios
                  .get(link)
                  .then(function(result) {
                    let otherEmailList = result.data;
                    console.log("Other Emailer", result.data);
                    let foundMail = false;
                    for (let x = 0; x < otherEmailList.length; x++) {
                      if (otherEmailList[x].id === id) {
                        foundMail = true;
                        let replies = otherEmailList[x].reply;
                        replies.push(email);
                        otherEmailList[x].reply = replies;
                      }
                    }
                    if (foundMail === false) {
                      otherEmailList.push(newEmail);
                    }
                    const filePath = "profileData/" + foundUser[0].userID + "/";
                    const otherEmails = new Blob(
                      [JSON.stringify(otherEmailList)],
                      {
                        type: "application/json"
                      }
                    );
                    let fileName = "";
                    if (!isBuyer) {
                      fileName = "sellingemails.txt";
                    } else {
                      fileName = "buyingemails.txt";
                    }
                    Backendless.Files.saveFile(
                      filePath,
                      fileName,
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
          })
          .catch(function(error) {});
      })
      .catch(function(error) {
        console.log("Error", error);
      });

    this.setState(
      {
        buying: true,
        open: false,
        mail: {},
        text: "",
        to: ""
      },
      () => {
        this.props.close();
      }
    );
  };

  render() {
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="md"
        fullWidth={true}
      >
        <DialogTitle id="form-dialog-title">Email to:</DialogTitle>
        <DialogContent>
          <FormLabel component="label"> Selling Inbox </FormLabel>

          <Switch
            checked={this.state.buying}
            onChange={this.handleChange("buying")}
            value="buying"
          />
          <FormLabel component="label"> Buying Inbox </FormLabel>
          <TextField
            margin="dense"
            id="to"
            label="To: "
            type="text"
            onChange={this.valChange}
            required={true}
            multiline={true}
            fullWidth
          />
          <TextField
            margin="dense"
            id="text"
            label="Content"
            type="text"
            onChange={this.valChange}
            required={true}
            multiline={true}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
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
    );
  }
}

export default passThrough;
