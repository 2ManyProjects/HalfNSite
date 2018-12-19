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
        <TitleSection />
        <StoreCardSection />
        <center>
          <StoreSearch />
        </center>
      </React.Fragment>
    );
  }
}

export default HomePage;
