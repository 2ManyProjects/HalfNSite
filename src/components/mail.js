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
  state = { expanded: false, expandable: false, reply: false };

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
            onClick={() => {
              console.log("REPLY", this.props.subject);
            }}
          >
            Reply
          </Button>
        </Card>
        <br />
      </div>
    );
  }
}

Mail.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Mail);
