import React, { Component } from "react";
import MailContainer from "./mail-container";
import Button from "@material-ui/core/Button";

class App extends Component {
  state = {
    showActive: true
  };
  handleClick = () => {
    this.setState({ showActive: !this.state.showActive });
  };
  getButton = () => {
    if (this.state.showActive) {
      return "SwitchTo: Buyer Inbox";
    } else {
      return "SwitchTo: Seller Inbox";
    }
  };
  render() {
    return (
      <div id="main">
        <center>
          <Button
            onClick={() => {
              this.handleClick();
            }}
            color="primary"
          >
            {this.getButton()}
          </Button>
        </center>
        <div hidden={!this.state.showActive}>
          <MailContainer
            getUser={this.props.getUser}
            getMessage={this.props.getMessage()}
            folder="Seller"
          />
        </div>
        <div hidden={this.state.showActive}>
          <MailContainer
            getUser={this.props.getUser}
            getMessage={this.props.getMessage()}
            folder="Buyer"
          />
        </div>
      </div>
    );
  }
}

export default App;
