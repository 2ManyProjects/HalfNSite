import React, { Component } from "react";

import "./style.scss";
import API_K from "./../../keys";
import axios from "axios";

const APPLICATION_ID = "C499EC1A-F6D2-77C2-FFCF-14A634B64900";
const API_KEY = API_K[0];
const serverURL =
  "https://api.backendless.com/" + APPLICATION_ID + "/" + API_KEY + "/";

class titleSection extends Component {
  state = {
    vote: -1,
    tagline: "",
    hide: false,
    data: {}
  };

  getHidden = () => {
    return this.state.hide;
  };

  sendVote = x => {
    axios
      .get(serverURL + "data/Website/6DF35F3E-B8F2-A39C-FF03-4B3BED42A000")
      .then(result => {
        this.setState({
          data: result.data
        });

        const jsonData = this.state.data;
        if (x === 0) {
          jsonData.FES += 1;
        } else {
          jsonData.FEB += 1;
        }
        this.setState({
          data: jsonData
        });

        axios
          .put(
            serverURL + "data/Website/6DF35F3E-B8F2-A39C-FF03-4B3BED42A000",
            jsonData
          )
          .then(function(response) {
            console.log(response);
          })
          .catch(function(error) {
            console.log(error);
          });
        console.log(this.state.data);
      });
  };

  handleVote = x => {
    this.setState({ vote: x });
    this.setState({ hide: true });
    if (x === 0) {
      this.setState({
        tagline: "A Friend in Every Store"
      });
    } else {
      this.setState({
        tagline: "Friends with Employee Benefits"
      });
    }
    this.sendVote(x);
  };

  renderTagline = () => {
    const { vote } = this.state;
    if (vote === -1) {
      return;
    } else {
      return <h1>{this.state.tagline}</h1>;
    }
  };

  render() {
    return (
      <div>
        <center>
          <br />
          <div hidden={this.getHidden()} className="subtitle">
            Help us choose our tag line
          </div>
          <button
            hidden={this.getHidden()}
            onClick={e => this.handleVote(0)}
            className="btn btn-secondary btn-sm m-2 btnhvr hiding"
          >
            A Friend in Every Store
          </button>
          <button
            hidden={this.getHidden()}
            onClick={e => this.handleVote(1)}
            className="btn btn-secondary btn-sm btnhvr hiding"
          >
            Friends with Employee Benefits
          </button>
          <span className="subtitle">{this.renderTagline()}</span>
        </center>
      </div>
    );
  }
}

export default titleSection;
