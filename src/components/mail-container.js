import React from "react";
import Mail from "./mail";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    width: "100%",
    maxWidth: 500
  }
};

class MailContainer extends React.Component {
  state = { content: "", drawn: false };
  drawEmail = () => {
    let mails = "";
    let content = "";
    const messageData = this.props.getMessage;
    const self = this;

    let email = "";
    if (this.props.folder === "Seller") {
      email = messageData.sellingEmails;
    } else if (this.props.folder === "Buyer") {
      email = messageData.buyingEmails;
    }
    console.log("Content", email);

    axios
      .get(email)
      .then(function(response) {
        mails = response.data;
        if (mails !== undefined) {
          content = mails.map((mail, index) => {
            console.log(mail);
            let reply = "";

            if (mail.reply !== undefined) {
              reply = mail.reply.map((re, reply_index) => {
                return (
                  <div key={reply_index} className="content">
                    <Mail
                      key={reply_index}
                      id={re.reply_id}
                      from={re.from}
                      to={re.to}
                      subject={re.title}
                      content={re.content}
                    />
                  </div>
                );
              });
            }

            let mailItem = mail;

            return (
              <center key={index} className="content">
                <Mail
                  key={index}
                  id={mailItem.id}
                  from={mailItem.from}
                  to={mailItem.to}
                  subject={mailItem.title}
                  content={mailItem.content}
                  reply={
                    <div>
                      <br />
                      {reply}
                    </div>
                  }
                />
                <br />
                <br />
              </center>
            );
          });

          self.setState({ content: content, drawn: true });
        }
      })
      .catch(function(error) {
        // console.log("File Link ", email);
        // console.log("Error Finding File", error.message);
      });
  };

  render() {
    const { classes } = this.props;
    if (!this.state.drawn) this.drawEmail();
    return (
      <center className="content">
        <center className={classes.root}>
          <Typography component="h3" variant="display4" gutterBottom>
            {this.props.folder}
          </Typography>
        </center>
        {this.state.content}
      </center>
    );
  }
}

MailContainer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MailContainer);
