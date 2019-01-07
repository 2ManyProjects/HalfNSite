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
import { Editor, EditorState, RichUtils } from "draft-js";

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
    expandable: false,
    reply: false,
    open: false,
    editorState: EditorState.createEmpty()
  };

  constructor(props) {
    super(props);
    this.onChange = editorState => this.setState({ editorState });
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

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
      if (this.props.reply.props.children[1] !== "") {
        expand = true;
      }
      this.setState({ expandable: expand, reply: true });
    } else {
      this.setState({ expandable: false });
    }
  };

  componentWillReceiveProps() {
    this.isExpandable();
  }

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return "handled";
    }
    return "not-handled";
  }

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
        </Card>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">Email</DialogTitle>
          <DialogContent>
            <Editor
              editorState={this.state.editorState}
              handleKeyCommand={this.handleKeyCommand}
              onChange={this.onChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
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
