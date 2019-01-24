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
import { DropzoneArea } from "material-ui-dropzone";
import axios from "axios";
import Backendless from "backendless";
import PassThrough from "./dialog/passthrough";
import { StripeProvider } from "react-stripe-elements";
import "./mailStyle.scss";

import Checkout from "./payment/Checkout";

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
    isAdmin: false,
    checkout: false,
    stripe: null,
    show: false,
    expandable: false,
    reply: false,
    open: false,
    email: {},
    image: false,
    money: false,
    value: 0,
    imageData: "",
    imageLinks: [],
    images: [],
    downloadLinks: [],
    files: [],
    showImages: false,
    text: "",
    clicked: [false, false, false],
    disabled: true,
    Errors: {
      message: ""
    }
  };
  handleClickOpen = () => {
    this.setState({ open: true });
  };
  handlePayment = () => {
    this.setState({ checkout: true });
  };
  handlePaymentClose = () => {
    this.setState({ checkout: false });
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
    console.log("Mail", this.props.mail);
    if (this.props.mail && this.props.mail.money !== undefined) {
      this.setState({
        money: this.props.mail.money,
        value: this.props.mail.value
      });
    }
    if (this.props.imageLinks && this.props.imageLinks.length !== 0)
      this.setState({ downloadLinks: this.props.imageLinks }, () => {
        this.displayImages();
      });
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

  // imageDownload = () => {
  //   const self = this;

  //   if (self.state.downloadLinks.length !== 0) {
  //     const path = self.state.downloadLinks[0].fileURL;
  //     axios
  //       .get(path)
  //       .then(function(response) {
  //         console.log("IMAGE DAT", response);
  //         let tempImages = self.state.images;
  //         tempImages.push(response.data);
  //         self.setState({ images: tempImages }, () => {
  //           let newFileList = self.state.downloadLinks;
  //           newFileList.shift();
  //           self.setState({ downloadLinks: newFileList }, () => {
  //             self.imageDownload();
  //           });
  //         });
  //       })
  //       .catch(function(error) {
  //         console.log("Error Downloading Image", error);
  //       });
  //   }
  // };

  imageUpload = () => {
    const self = this;
    if (self.state.files.length !== 0) {
      const path = "profileData/" + self.props.objectId + "/images";
      const pic = new Blob([self.state.files[0]], {
        type: self.state.files[0].type
      });
      let nameSplit = self.state.files[0].name.split(".");
      Backendless.Files.saveFile(
        path,
        self.generateGuid() + "." + nameSplit[1],
        pic,
        true
      )
        .then(function(fileURL) {
          let linkList = self.state.imageLinks;
          linkList.push(fileURL);
          self.setState({ imageLinks: linkList }, () => {
            let newFileList = self.state.files;
            newFileList.shift();
            self.setState({ files: newFileList }, () => {
              self.imageUpload();
            });
          });
        })
        .catch(function(error) {
          console.log("error - " + error.message);
        });
    } else {
      self.sendMail();
    }
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
      imageLinks: this.state.imageLinks,
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
            if (self.state.isAdmin) {
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
                .post(
                  "https://api.backendless.com/C499EC1A-F6D2-77C2-FFCF-14A634B64900/9EB16649-E4D8-8EAC-FFF8-6B8CE47C7600/services/MyService/sendAdminMail",
                  {
                    record: record,
                    id: id,
                    email: email,
                    reply: true
                  },
                  {
                    headers: {
                      "Content-Type": "application/json"
                    }
                  }
                )
                .then(function(response) {
                  console.log("Message Init", response);
                })
                .catch(function(error) {
                  console.log("Message Error", error);
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
        image: false,
        imageLinks: [],
        text: "",
        money: false,
        files: [],
        value: 0,
        clicked: [false, false, false],
        showImages: false,
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
    const self = this;
    if (this.props.objectId) {
      axios
        .post(
          "https://api.backendless.com/C499EC1A-F6D2-77C2-FFCF-14A634B64900/9EB16649-E4D8-8EAC-FFF8-6B8CE47C7600/services/MyService/isAdmin",
          { id: self.props.objectId },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(function(response) {
          self.setState({
            isAdmin: response.data
          });
        })
        .catch(function(error) {
          console.log("Error", error.message);
        });
    }
  };

  validateErrors = () => {
    const val = this.state.Errors.message.length > 0;
    this.setState({ disabled: val });
  };

  //this loads stripe each time, FIX IT
  componentDidMount() {
    this.isExpandable();
    this.isAdmin();
    this.setState({
      stripe: this.props.stripe
    });
  }

  getName() {
    if (this.props.to !== this.props.getName) return this.props.to;
    else return this.props.from;
  }

  componentDidUpdate() {}

  openDialog = () => {
    this.setState({ show: true, mail: this.props.mail });
  };
  handleSave = files => {
    //Saving files to state for further use and closing Modal.
    this.setState({
      files: files
    });
  };
  handleImage = () => {
    this.setState({
      image: !this.state.image
    });
  };
  dropZone = () => {
    if (!this.state.image) return "Add Image";
    else return "Min DragZone";
  };

  getSubject = () => {
    // console.log("Subject", this.props);
    if (this.props.subject && this.props.subject.length > 0) return false;
    else return true;
  };

  hasImages = () => {
    if (this.state.downloadLinks.length !== 0) return false;
    else return true;
  };

  showImages = () => {
    this.setState({ showImages: !this.state.showImages });
  };

  displayImages = () => {
    let imageData = this.state.downloadLinks.map((image, image_index) => {
      return (
        <div key={image_index}>
          <img
            onClick={() => {
              let clicked = [...this.state.clicked];
              clicked[image_index] = true;
              console.log("Thumbnail: ", clicked);
              this.setState({ clicked }, () => {
                this.displayImages();
              });
            }}
            className="thumbnail"
            src={image.fileURL}
            alt="new"
            width="50%"
            height="50%"
          />

          <Dialog
            open={this.state.clicked[image_index]}
            onClose={() => {
              let clicked = [...this.state.clicked];
              clicked[image_index] = false;
              console.log("On Ext: ", clicked);
              this.setState({ clicked }, () => {
                this.displayImages();
              });
            }}
            aria-labelledby="form-dialog-title"
          >
            <img src={image.fileURL} alt="new" width="100%" height="100%" />
            <DialogActions>
              <Button
                onClick={() => {
                  let clicked = [...this.state.clicked];
                  clicked[image_index] = false;
                  console.log("On Btn: ", clicked);
                  this.setState({ clicked }, () => {
                    this.displayImages();
                  });
                }}
                color="primary"
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    });
    this.setState({ imageData: imageData });
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Card className={classes.card}>
          <CardHeader
            title={
              <div>
                From: {this.props.from}
                <br /> <div>To: {this.props.to}</div>
              </div>
            }
            subheader={
              <div hidden={this.getSubject()}>
                Subject: {this.props.subject}
              </div>
            }
          />

          <CardContent>
            <CardContent>{this.props.content}</CardContent>
            <Button
              hidden={this.hasImages()}
              className="m-2"
              variant="contained"
              color="secondary"
              onClick={this.showImages}
            >
              Show Images
            </Button>
            <div hidden={!this.state.showImages}>{this.state.imageData}</div>
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
            hidden={!this.state.money}
            className="m-2"
            variant="contained"
            color="secondary"
            onClick={this.handlePayment}
          >
            Payment of: {this.state.value} CAD
          </Button>
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
            hidden={!this.state.isAdmin}
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
          open={this.state.checkout}
          onClose={this.handlePaymentClose}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">Payment</DialogTitle>
          <StripeProvider stripe={this.state.stripe}>
            <Checkout stripe={this.state.stripe} money={this.state.value} />
          </StripeProvider>
          <DialogActions>
            <Button onClick={this.handlePaymentClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
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
            <Button onClick={this.handleImage} color="primary">
              {this.dropZone()}
            </Button>
            <div hidden={!this.state.image}>
              <DropzoneArea
                onChange={this.handleSave}
                acceptedFiles={["image/jpeg", "image/png", "image/bmp"]}
                filesLimit={3}
                maxFileSize={5000000}
              />
            </div>
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
              onClick={this.imageUpload}
              color="primary"
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>
        <br />
      </React.Fragment>
    );
  }
}

Mail.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Mail);
