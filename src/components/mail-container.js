import React from "react";
import MAILS from "../mails";
import Mail from "./mail";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import API_K from "./../keys";
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles
} from "@material-ui/core/styles";

const APPLICATION_ID = "C499EC1A-F6D2-77C2-FFCF-14A634B64900";
const API_KEY = API_K[0];
const JS_KEY = API_K[1];
const serverURL =
  "https://api.backendless.com/" + APPLICATION_ID + "/" + API_KEY + "/";

const styles = {
  root: {
    width: "100%",
    maxWidth: 500
  }
};

function typographyV1Theme(theme) {
  return createMuiTheme({
    ...theme,
    typography: {
      useNextVariants: false
    }
  });
}
function MailContainer(props) {
  const { classes } = props;
  const mails = MAILS[props.folder];
  let content = "";
  const messageData = props.getMessage;
  //   console.log("UserData ", messageData);
  let email = "";
  if (props.folder === "Seller") {
    email = messageData.sellingEmails;
  } else if (props.folder === "Buyer") {
    email = messageData.buyingEmails;
  }
  axios
    .get(email)
    .then(function(response) {
      console.log("EMAILS " + props.folder, response);
    })
    .catch(function(error) {
      //   console.log("File Link ", email);
      //   console.log("Error Finding File", error.message);
    });

  if (mails !== undefined) {
    content = Object.keys(mails).map((id, index) => {
      let reply = "";

      if (mails[id].reply !== undefined) {
        reply = Object.keys(mails[id].reply).map((reply_id, reply_index) => {
          let replyItem = mails[id].reply[reply_id];

          return (
            <div key={reply_index} className="content">
              <Mail
                key={reply_index}
                id={replyItem.reply_id}
                from={replyItem.from}
                to={replyItem.to}
                subject={replyItem.title}
                content={replyItem.content}
              />
            </div>
          );
        });
      }

      let mailItem = mails[id];

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
  }

  return (
    <center className="content">
      <center className={classes.root}>
        <Typography component="h3" variant="display4" gutterBottom>
          {props.folder}
        </Typography>
      </center>
      {content}
    </center>
  );
}

MailContainer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MailContainer);
