import React, { Component } from "react";
import axios from "axios";
import Suggestions from "./suggestions";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Email from "./../dialog/buyingDialog";
import Backendless from "backendless";
import Button from "@material-ui/core/Button";
// import Menu from "@material-ui/core/Menu";
// import MenuItem from "@material-ui/core/MenuItem";
// import { withStyles } from "@material-ui/core/styles";

import API_K from "./../../keys";
const APPLICATION_ID = "C499EC1A-F6D2-77C2-FFCF-14A634B64900";
const API_KEY = API_K[0];
const serverURL =
  "https://api.backendless.com/" + APPLICATION_ID + "/" + API_KEY + "/";

class Search extends Component {
  state = {
    query: "",
    storeName: "",
    results: [],
    showTable: false,
    userIDs: [],
    userData: [],
    tableData: [],
    single: "",
    popper: "",
    show: false,
    anchorEl: null,
    profile: {}
  };

  handleInputChange = () => {
    this.setState(
      {
        query: this.search.value
      },
      () => {
        if (this.state.query && this.state.query.length > 1) {
          this.getInfo(false);
        }
        return false;
      }
    );
  };

  handlePress = e => {
    if (e.charCode === 13) {
      e.preventDefault();
      this.getInfo(true);
    }
    return false;
  };

  getInfo = submitting => {
    if (!submitting) {
      const self = this;
      var whereClause = "name LIKE '" + this.state.query + "%'";
      var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(
        whereClause
      );
      Backendless.Data.of("Stores")
        .find(queryBuilder)
        .then(function(results) {
          let name = "";
          if (results[0] !== undefined) name = results[0].Name;

          const newArr = results.filter(store => {
            const distance = self.getDistance(store.Lat, store.Long);
            if (distance < 100) return store;
            else return null;
          });

          self.setState({
            results: newArr,
            storeName: name
          });
        })
        .catch(function(fault) {
          // an error has occurred, the error code can be retrieved with fault.statusCode
        });
    } else {
      this.fillID();
    }
  };

  getDistance = (lat, lon) => {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat - this.props.getCoords.lat); // deg2rad below
    var dLon = this.deg2rad(lon - this.props.getCoords.lng);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(this.props.getCoords.lat)) *
        Math.cos(this.deg2rad(lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  };

  deg2rad = deg => {
    return deg * (Math.PI / 180);
  };

  getDealType = bool => {
    if (bool === false) return "Normal";
    return "Factory +  Discount";
  };

  fillID = () => {
    let tempArr = [];
    for (let i = 0; i < this.state.results.length; i++) {
      if (
        this.state.results[0] !== undefined &&
        this.state.results[0].UserList !== null
      ) {
        let newArr = JSON.parse(this.state.results[0].UserList);
        if (this.props.getLogged) {
          newArr = newArr.filter(id => id !== this.props.getUser.objectId);
        }
        tempArr = tempArr.concat(newArr);
      }
    }
    this.setState(
      {
        userIDs: tempArr
      },
      () => {
        this.fillUserData();
      }
    );
  };

  fillUserData = () => {
    if (this.state.results[0] !== undefined) {
      let tempArr = [];
      for (let i = 0; i < this.state.userIDs.length; i++) {
        axios
          .get(serverURL + "data/Users/" + this.state.userIDs[i])
          .then(result => {
            axios.get(result.data.profile).then(profileData => {
              const tempData = result.data;
              for (let x = 0; x < profileData.data.length; x++) {
                // console.log(
                //   "Store",
                //   this.state.results[0],
                //   profileData.data[x]
                // );
                if (
                  profileData.data[x].name.includes(this.state.results[0].Name)
                ) {
                  tempData["storeData"] = profileData.data[x];
                  break;
                }
              }
              tempArr.push(tempData);
              this.setState({
                userData: tempArr
              });
              if (i === this.state.userIDs.length - 1) {
                this.generateTableData();
              }
            });
          });
      }
    }
  };

  generateTableData = () => {
    let data = [];
    for (let i = 0; i < this.state.userData.length; i++) {
      let deals = [];
      for (
        let x = 0;
        x < this.state.userData[i].storeData.storeDeals.length;
        x++
      ) {
        const tempData = {
          id: this.state.userData[i].storeData.storeDeals[x].id,
          atcost: this.state.userData[i].storeData.storeDeals[x].atCost,
          currentAmnt: this.state.userData[i].storeData.storeDeals[x]
            .currentAmnt,
          rate: this.state.userData[i].storeData.storeDeals[x].rate,
          totalAmnt: this.state.userData[i].storeData.storeDeals[x].totalAmnt,
          text: this.state.userData[i].storeData.storeDeals[x].text,
          selected: false,
          selectedAmnt: 0
        };
        deals.push(tempData);
      }

      const tempData = {
        name: this.state.userData[i].name,
        transactions: this.state.userData[i].sellnum,
        rating: this.state.userData[i].rating,
        messageID: this.state.userData[i].messageID,
        objectID: this.state.userData[i].objectId,
        sellnum: this.state.userData[i].sellnum,
        buynum: this.state.userData[i].buynum,
        email: this.state.userData[i].email,
        profile: this.state.userData[i].profile,
        deals: deals
      };
      data.push(tempData);
    }
    this.setState({ tableData: data });
  };

  generateDealData = deals => {
    let data = [];
    for (let i = 0; i < deals.length; i++) {
      const tempData = {
        atcost: deals[i].atcost,
        currentAmnt: deals[i].currentAmnt,
        rate: deals[i].rate,
        totalAmnt: deals[i].totalAmnt,
        text: deals[i].text
      };
      data.push(tempData);
    }
    const columns = [
      {
        Header: "Type",
        id: "atcost",
        accessor: d => this.getDealType(d.atcost)
      },
      {
        Header: "Discount Rate",
        id: "rate",
        accessor: d => d.rate,
        Cell: props => <span className="number">{props.value}%</span> // Custom cell components!
      },
      {
        Header: "Restrictions",
        id: "text",
        accessor: d => d.text
      },
      {
        Header: "TotalAmount",
        id: "totalAmnt",
        accessor: d => d.totalAmnt
      },
      {
        Header: "Current Amount",
        id: "currentAmnt",
        accessor: d => d.currentAmnt
      }
    ];
    let pageSize = 3;
    if (deals.length < 3) pageSize = deals.length;

    return (
      <div>
        <ReactTable
          data={data}
          columns={columns}
          defaultPageSize={pageSize}
          showPageSizeOptions={false}
          showPageJump={false}
          showPagination={false}
          className="-striped -highlight"
          resizable={false}
        />
      </div>
    );
  };

  sendTestEmail = (e, props) => {
    e.preventDefault();

    this.setState({ show: true, profile: props });
  };

  handleMenuClose = name => {
    this.setState({ query: name, anchorEl: null });
  };

  render() {
    const columns = [
      {
        Header: "Select",
        id: "button",
        accessor: d => d,
        maxWidth: 130,
        Cell: props => (
          <Button
            disabled={!this.props.getLogged}
            onClick={e => this.sendTestEmail(e, props.original)}
            color="primary"
            variant="outlined"
          >
            Send Email
          </Button>
        ) // Custom cell components!
      },
      {
        Header: "Name",
        accessor: "name",
        maxWidth: 100
      },
      {
        Header: "Transactions",
        accessor: "transactions",
        maxWidth: 100
      },
      {
        Header: "Rating",
        accessor: "rating",
        maxWidth: 100
      },
      {
        Header: "# of Discounts",
        id: "numDiscounts",
        accessor: d => d.deals.length,
        maxWidth: 120
      },
      {
        Header: "Deals",
        id: "Deals",
        accessor: d => this.generateDealData(d.deals)
      }
    ];
    return (
      <div>
        <form>
          <input
            placeholder="Search our Stores"
            ref={input => (this.search = input)}
            onChange={this.handleInputChange}
            onKeyPress={this.handlePress}
            // onFocus={() => {
            //   focused = true;
            // }}
            // onBlur={() => {
            //   focused = false;
            // }}
          />
          <Suggestions results={this.state.results} />

          {/* <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={focused}
            onClose={() => {
              focused = false;
            }}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: 200
              }
            }}
          >
            {this.state.results.map((result, result_index) => (
              <MenuItem
                key={result_index}
                onClick={this.handleMenuClose(result.Name)}
              >
                {result.Name}
              </MenuItem>
            ))}
          </Menu> */}
          <br />
          <Email
            show={this.state.show}
            storeName={this.state.storeName}
            profile={this.state.profile}
            getUser={this.props.getUser}
            getMessage={this.props.getMessage}
            emailLink={serverURL + "messaging/email"}
            close={() => {
              this.setState({ show: false, deal: {} });
            }}
          />
          <center>
            <ReactTable
              data={this.state.tableData}
              columns={columns}
              defaultPageSize={20}
              className="-striped -highlight"
              resizable={false}
              noDataText={false}
            />
          </center>
        </form>
      </div>
    );
  }
}

export default Search;
