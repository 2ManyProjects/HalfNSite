import React, { Component } from "react";
import "./App.css";
import PropTypes from "prop-types";
import HomePage from "./components/homePage/index";
import NavBar from "./components/dialog/login";
import SellerProfile from "./components/profile/sellerProfile";
import { withStyles } from "@material-ui/core/styles";
import Backendless from "backendless";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Router, IndexRoute } from "react-router";
import { HashRouter, Route, Link } from "react-router-dom";
import MailBox from "./components/app";

// import Button from "@material-ui/core/Button";
import API_K from "./keys";

const APPLICATION_ID = "C499EC1A-F6D2-77C2-FFCF-14A634B64900";
// const API_KEY = API_K[0];
const JS_KEY = API_K[1];
// const serverURL =
//   "https://api.backendless.com/" + APPLICATION_ID + "/" + API_KEY + "/";
Backendless.initApp(APPLICATION_ID, JS_KEY);
const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  close: {
    padding: theme.spacing.unit / 2
  },
  input: {
    display: "none"
  }
});

class App extends Component {
  state = {
    loggedin: false,
    userData: {},
    snackbar: false,
    show: {
      homePage: true,
      mailbox: false,
      sellerPage: false,
      buyerPage: false,
      accountPage: false
    },
    storeData: []
  };

  componentDidMount() {}

  changePage = x => {
    let data;
    switch (x) {
      case 0:
        data = {
          homePage: true,
          mailbox: false,
          sellerPage: false,
          buyerPage: false,
          accountPage: false
        };
        break;
      case 1:
        data = {
          homePage: false,
          mailbox: false,
          sellerPage: true,
          buyerPage: false,
          accountPage: false
        };
        break;
      case 2:
        data = {
          homePage: false,
          mailbox: false,
          sellerPage: false,
          buyerPage: true,
          accountPage: false
        };
        break;
      case 3:
        data = {
          homePage: false,
          mailbox: false,
          sellerPage: false,
          buyerPage: false,
          accountPage: true
        };
        break;
      case 4:
        data = {
          homePage: false,
          mailbox: true,
          sellerPage: false,
          buyerPage: false,
          accountPage: false
        };
        break;
      default:
        break;
    }
    this.setState({ show: data }, () => {
      // console.log("STATE", this.state.show);
    });
  };
  handleClick = () => {
    this.setState({ snackbar: true });
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ snackbar: false });
  };

  initUserdata = jsonData => {
    this.setState({ loggedin: true, userData: jsonData });
  };
  storeInit = jsonData => {
    this.setState({ storeData: jsonData });
    console.log("STOREDATA: ", jsonData);
  };

  getAuthToken = () => {
    return this.state.userData["user-token"];
  };
  getUserData = () => {
    return this.state.userData;
  };
  handleStoreDelete = cardID => {
    const storeData = this.state.storeData.filter(c => c.ID !== cardID);
    this.setState({ storeData: storeData }, () => {
      const whereClause = "StoreID = " + "'" + cardID + "'";
      const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(
        whereClause
      );
      const self = this;
      Backendless.Data.of("Stores")
        .find(queryBuilder)
        .then(function(foundContacts) {
          let data = [];
          data = JSON.parse(foundContacts[0].UserList);
          data = data.filter(user => user !== self.state.userData.objectId);
          if (data.length === 0) {
            Backendless.Data.of("Stores")
              .remove({ objectId: foundContacts[0].objectId })
              .then(function(timestamp) {})
              .catch(function(error) {});
          } else {
            let tempStore = foundContacts[0];
            tempStore.UserList = JSON.stringify(data);
            Backendless.Data.of("Stores")
              .save(tempStore)
              .then(function(savedObject) {
                console.log("Store instance has been updated", savedObject);
              })
              .catch(function(error) {
                console.log("an error has occurred " + error.message);
              });
          }
          const path = "profileData/" + self.getUserData().objectId + "/";
          const stores = new Blob([JSON.stringify(self.state.storeData)], {
            type: "application/json"
          });
          console.log("DELETE", stores);
          Backendless.Files.saveFile(path, "profileData.txt", stores, true)
            .then(function(fileURL) {})
            .catch(function(error) {});
        })
        .catch(function(fault) {
          // an error has occurred, the error code can be retrieved with fault.statusCode
        });
    });
  };

  handleStoreCreate = (store, rawData) => {
    const raw = rawData;
    let storeData = this.state.storeData;
    const newStore = {
      ID: raw.place_id,
      address: raw.vicinity,
      buyer: "",
      dealProgression: 0,
      imageResource: 0,
      isNew: false,
      name: raw.name,
      seller: this.getUserData().name,
      storeDeals: [{}]
    };
    storeData.push(newStore);
    console.log("STOREDATA", storeData);
    this.setState({ storeData: storeData }, () => {
      const whereClause = "StoreID = " + "'" + store.ID + "'";
      const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(
        whereClause
      );
      const self = this;
      Backendless.Data.of("Stores")
        .find(queryBuilder)
        .then(function(foundStores) {
          let data = [];
          if (foundStores.length === 0) {
            data = [self.getUserData().objectId];
            let tempStore = store;
            tempStore.UserList = JSON.stringify(data);
            Backendless.Data.of("Stores")
              .save(tempStore)
              .then(function(savedObject) {
                console.log("Store instance has been created", savedObject);
              })
              .catch(function(error) {
                console.log("an error has occurred " + error.message);
              });
          } else {
            data = JSON.parse(foundStores[0].UserList);
            if (!data.includes(self.getUserData().objectId)) {
              data.push(self.getUserData().objectId);
              let tempStore = foundStores[0];
              tempStore.UserList = JSON.stringify(data);
              Backendless.Data.of("Stores")
                .save(tempStore)
                .then(function(savedObject) {
                  console.log("Store instance has been updated", savedObject);
                })
                .catch(function(error) {
                  console.log("an error has occurred " + error.message);
                });
            } else {
              self.setState({ snackbar: true });
            }
          }
          const path = "profileData/" + self.getUserData().objectId + "/";
          const stores = new Blob([JSON.stringify(self.state.storeData)], {
            type: "application/json"
          });
          console.log("ADD", JSON.stringify(self.state.storeData));
          Backendless.Files.saveFile(path, "profileData.txt", stores, true)
            .then(function(fileURL) {})
            .catch(function(error) {});
        })
        .catch(function(fault) {
          console.log("Store Add Error", fault);
          // an error has occurred, the error code can be retrieved with fault.statusCode
        });
    });
  };

  handleDealDelete = (store, deal) => {
    const newStoreDeals = store.storeDeals.filter(d => d !== deal);
    let newStore = store;
    newStore.storeDeals = newStoreDeals;
    console.log("NEW LIST", newStore);
    const Stores = [...this.state.storeData];
    const index = Stores.indexOf(store);
    Stores[index] = { ...store };
    Stores[index] = newStore;
    this.setState({ storeData: Stores });
    const self = this;

    const path = "profileData/" + self.getUserData().objectId + "/";
    const stores = new Blob([JSON.stringify(self.state.storeData)], {
      type: "application/json"
    });
    console.log("DELETE", stores);
    Backendless.Files.saveFile(path, "profileData.txt", stores, true)
      .then(function(fileURL) {})
      .catch(function(error) {});
  };
  handleDealEdit = (store, deal, newDeal) => {
    const dealIndex = store.storeDeals.indexOf(deal);
    let newStore = store;
    newStore.storeDeals[dealIndex] = newDeal;
    console.log("NEW LIST", newStore);
    const Stores = [...this.state.storeData];
    const index = Stores.indexOf(store);
    Stores[index] = { ...store };
    Stores[index] = newStore;
    this.setState({ storeData: Stores });
    const self = this;

    const path = "profileData/" + self.getUserData().objectId + "/";
    const stores = new Blob([JSON.stringify(self.state.storeData)], {
      type: "application/json"
    });
    console.log("UPDATE", stores);
    Backendless.Files.saveFile(path, "profileData.txt", stores, true)
      .then(function(fileURL) {})
      .catch(function(error) {});
  };

  handleDealAdd = (store, newDeal) => {
    let newStore = store;
    newStore.storeDeals.push(newDeal);
    const Stores = [...this.state.storeData];
    const index = Stores.indexOf(store);
    Stores[index] = { ...store };
    Stores[index] = newStore;
    this.setState({ storeData: Stores });
    const self = this;
    const path = "profileData/" + self.getUserData().objectId + "/";
    const stores = new Blob([JSON.stringify(self.state.storeData)], {
      type: "application/json"
    });
    Backendless.Files.saveFile(path, "profileData.txt", stores, true)
      .then(function(fileURL) {})
      .catch(function(error) {});
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <NavBar
          onInit={this.initUserdata}
          onStoreInit={this.storeInit}
          getAuth={this.getAuthToken}
          getUser={this.getUserData}
          updatePage={this.changePage}
        />
        <div hidden={!this.state.show.mailbox}>
          <MailBox />
        </div>
        <div hidden={!this.state.show.homePage}>
          <HomePage
            getUser={this.state.userData}
            getLogged={this.state.loggedin}
          />
        </div>
        <div hidden={!this.state.show.sellerPage}>
          <SellerProfile
            getUser={this.getUserData}
            onDelete={this.handleStoreDelete}
            onDealDelete={this.handleDealDelete}
            onDealEdit={this.handleDealEdit}
            onDealCreate={this.handleDealAdd}
            onCreate={this.handleStoreCreate}
            storeData={this.state.storeData}
          />
        </div>
        <div>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}
            open={this.state.snackbar}
            autoHideDuration={6000}
            onClose={this.handleClose}
            ContentProps={{
              "aria-describedby": "message-id"
            }}
            message={
              <span id="message-id">
                You are Already Registered to this store
              </span>
            }
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={this.handleClose}
              >
                <CloseIcon />
              </IconButton>
            ]}
          />
        </div>
      </React.Fragment>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);

//import NavBar from "./components/navBar";
//import Counters from "./components/counters";
// maxId: 4,
// counters: [
//   { id: 1, value: 0 },
//   { id: 2, value: 0 },
//   { id: 3, value: 0 },
//   { id: 4, value: 0 }
// ],

/* <NavBar
          totalcounters={this.state.counters.filter(c => c.value > 0).length}
        />
        <main className="container">
          <Counters
            onReset={this.handleReset}
            onDelete={this.handleDelete}
            onIncrement={this.handleIncrement}
            onDecrement={this.handleDecrement}
            onCreate={this.handleCreate}
            counters={this.state.counters}
          />
        </main> */

// handleDelete = counterId => {
//   const counters = this.state.counters.filter(c => c.id !== counterId);
//   this.setState({ counters: counters });
//   console.log("delete", counterId);
// };
// handleCreate = () => {
//   const newId = this.state.maxId + 1;
//   const counters = this.state.counters.concat({
//     id: newId,
//     value: 0
//   });
//   this.setState({ counters: counters });
//   this.setState({ maxId: newId });
// };

// handleReset = () => {
//   const counters = this.state.counters.map(c => {
//     c.value = 0;
//     return c;
//   });

//   this.setState({ counters });
// };

// handleIncrement = counter => {
//   const counters = [...this.state.counters];
//   const index = counters.indexOf(counter);
//   counters[index] = { ...counter };
//   counters[index].value++;

//   this.setState({ counters });
// };

// handleDecrement = counter => {
//   const counters = [...this.state.counters];
//   const index = counters.indexOf(counter);
//   counters[index] = { ...counter };
//   counters[index].value--;
//   if (counters[index].value >= 0) this.setState({ counters });
// };
