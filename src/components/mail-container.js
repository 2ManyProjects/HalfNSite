import React from "react";
import MAILS from "../mails";
import Mail from "./mail";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles
} from "@material-ui/core/styles";

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
