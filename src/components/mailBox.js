import React, { Component } from "react";
import MailContainer from "./mail-container";
import Button from "@material-ui/core/Button";
import { Route, NavLink } from "react-router-dom";

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
          <NavLink
            to={
              this.state.showActive
                ? "/mailBox/buyerInbox"
                : "/mailBox/sellerInbox"
            }
          >
            <Button
              onClick={() => {
                this.handleClick();
              }}
              color="primary"
            >
              {this.getButton()}
            </Button>
          </NavLink>
        </center>
        <Route
          path="/mailBox/buyerInbox"
          render={props => (
            <MailContainer
              {...props}
              stripe={this.props.stripe}
              getUser={this.props.getUser}
              getMessage={this.props.getMessage()}
              folder="Buyer"
            />
          )}
        />
        <Route
          path="/mailBox/sellerInbox"
          render={props => (
            <MailContainer
              {...props}
              stripe={this.props.stripe}
              getUser={this.props.getUser}
              getMessage={this.props.getMessage()}
              folder="Seller"
            />
          )}
        />
      </div>
    );
  }
}

export default App;
