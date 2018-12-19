import React, { Component } from "react";
import axios from "axios";
import Suggestions from "./suggestions";
import ReactTable from "react-table";
import "react-table/react-table.css";

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
    userIDs: [],
    userData: [],
    tableData: []
  };

  handleInputChange = () => {
    this.setState(
      {
        query: this.search.value
      },
      () => {
        if (this.state.query && this.state.query.length > 1) {
          if (this.state.query.length % 2 === 0) {
            this.getInfo(false);
          }
        }
        return false;
      }
    );
  };

  handlePress = e => {
    if (e.charCode === 13) {
      e.preventDefault();
      this.onSubmit(e);
    }
    return false;
  };

  onSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    this.getInfo(true);
  };

  getInfo = submitting => {
    if (!submitting) {
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
        });
    } else {
      this.fillID();
    }
  };

  getDealType = bool => {
    if (bool === false) return "Normal";
    return "Factory +  Discount";
  };

  fillID = () => {
    let tempArr = [];
    for (let i = 0; i < this.state.results.length; i++) {
      if (this.state.results[i].UserList !== null) {
        const newArr = this.state.results[i].UserList.split("#").filter(
          users => users !== ""
        );
        tempArr = tempArr.concat(newArr);
      }
    }
    this.setState({
      userIDs: tempArr
    });
    this.fillUserData();
  };

  fillUserData = () => {
    let tempArr = [];
    for (let i = 0; i < this.state.userIDs.length; i++) {
      axios
        .get(serverURL + "data/Users/" + this.state.userIDs[i])
        .then(result => {
          axios.get(result.data.profile).then(profileData => {
            const tempData = result.data;
            for (let x = 0; x < profileData.data.length; x++) {
              // console.log(this.state.results[0].Name, profileData.data[x]);
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
    console.log("DATA", props);
    const jsonData = {
      subject: "New MESSAGE",
      bodyparts: {
        textmessage: props.objectID
      },
      to: ["hello.half.n.half@gmail.com"]
    };
    console.log(serverURL + "messaging/email");
    axios
      .post(serverURL + "messaging/email", jsonData)
      .then(function(response) {
        console.log("Sent", response);
      })
      .catch(function(error) {
        console.log("Error", error);
      });
  };

  render() {
    const columns = [
      {
        Header: "Select",
        id: "button",
        accessor: d => d,
        maxWidth: 100,
        Cell: props => (
          <button
            onClick={e => this.sendTestEmail(e, props.original)}
            className="btn btn-secondary btn-sm m-2 btnhvr"
          >
            Send Email
          </button>
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
          />
          <Suggestions results={this.state.results} />
          <br />
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