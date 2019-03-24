import React, { Component } from "react";
import StoreCardSection from "../storeCardSection/index";
import TitleSection from "../titleSection/index";
import StoreSearch from "../storeSearch/index";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <TitleSection getLogged={this.props.getLogged} />
        {/* <StoreCardSection /> */}
        <center>
          <StoreSearch
            getCoords={this.props.getCoords}
            getUser={this.props.getUser}
            getMessage={this.props.getMessage}
            getLogged={this.props.getLogged}
          />
        </center>
      </React.Fragment>
    );
  }
}

export default HomePage;
