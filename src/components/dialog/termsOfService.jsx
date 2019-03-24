import React, { Component } from "react";
import tos from "../../TermsofService";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500]
  }
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit
  }
}))(MuiDialogActions);

class TermsOfService extends Component {
  state = {
    open: false
  };
  componentWillReceiveProps(props) {
    this.setState({ open: props.open });
  }

  render() {
    return (
      <div>
        <Dialog
          aria-labelledby="customized-dialog-title"
          open={this.state.open}
        >
          <DialogTitle id="customized-dialog-title">
            Terms of Service
          </DialogTitle>
          <DialogContent>
            <Typography gutterBottom>{tos}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.props.accepted();
              }}
              color="primary"
            >
              Accept
            </Button>
            <Button
              onClick={() => {
                this.props.declined();
              }}
              color="primary"
            >
              Decline
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default TermsOfService;
