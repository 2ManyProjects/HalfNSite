import React, { Component } from "react";

import "./style.scss";

class storeCard extends Component {
  render() {
    return (
      <div className="store-card col-sm-6 ">
        <a href={this.props.link} rel="noopener noreferrer" target="_blank">
          <div
            className="image"
            style={{
              backgroundImage: `url(${this.props.logo})`,
              backgroundColor: this.props.colour
            }}
          >
            <div className="greenBox" />
            <div
              className="discount"
              style={{ color: this.props.contrastColor }}
            >
              {this.props.largestDiscount}%
            </div>
          </div>
        </a>
        {/* <div className="title bold">{this.props.title}</div>
        <div className="Employeenumber">{this.props.numEmployees}</div>
        <div className="subtitle">{this.props.subtitle}</div> */}
      </div>
    );
  }
}

export default storeCard;
//style={{ width: 50, height: 50, backgroundColor: "blue" }}
