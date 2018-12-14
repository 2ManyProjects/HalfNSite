import React, { Component } from "react";
import axios from "axios";
import Suggestions from "./suggestions";

import API_K from "./../../keys";
const APPLICATION_ID = "C499EC1A-F6D2-77C2-FFCF-14A634B64900";
const API_KEY = API_K;
const serverURL =
  "https://api.backendless.com/" + APPLICATION_ID + "/" + API_KEY + "/";

class Search extends Component {
  state = {
    query: "",
    results: [],
    showTable: false,
    userIDs: []
  };

  getInfo = () => {
    console.log(
      "ServerURL ",
      serverURL +
        "data/Stores?where=Name%20LIKE%20'%25" +
        this.state.query +
        "%25'"
    );
    axios
      .get(
        serverURL +
          "data/Stores?where=Name%20LIKE%20'%25" +
          this.state.query +
          "%25'"
      )
      .then(result => {
        this.setState({
          results: result.data
        });
        console.log("RESULTS", this.state.results);
      });
  };

  handleInputChange = () => {
    this.setState(
      {
        query: this.search.value
      },
      () => {
        if (this.state.query && this.state.query.length > 1) {
          if (this.state.query.length % 2 === 0) {
            this.getInfo();
          }
        }
        return false;
      }
    );
  };

  handlePress = e => {
    if (e.charCode === 13) {
      e.preventDefault();
      console.log("ENTER");
      this.onSubmit(e);
    }
    return false;
  };

  onSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Submit");
  };

  render() {
    return (
      <div>
        <form>
          <input
            placeholder="Search our Stores"
            ref={input => (this.search = input)}
            onChange={this.handleInputChange}
            onKeyPress={this.handlePress}
          />
          <Suggestions results={this.state.results} />
        </form>
        <table />
      </div>
    );
  }
}

export default Search;
