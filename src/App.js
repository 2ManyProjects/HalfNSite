import React, { Component } from "react";
import "./App.css";
import CookieConsent from "react-cookie-consent";
import { Route, HashRouter, Redirect } from "react-router-dom";
import { withCookies, Cookies } from "react-cookie";
import { instanceOf } from "prop-types";
import PropTypes from "prop-types";
import HomePage from "./components/homePage/homePage";
import NavBar from "./components/dialog/navBar";
import SellerProfile from "./components/profile/sellerProfile";
import { withStyles } from "@material-ui/core/styles";
import Backendless from "backendless";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MailBox from "./components/mailBox";
import axios from "axios";
import API_K from "./keys";

const APPLICATION_ID = "C499EC1A-F6D2-77C2-FFCF-14A634B64900";
const API_KEY = API_K[0];
const serverURL =
  "https://api.backendless.com/" + APPLICATION_ID + "/" + API_KEY + "/";
const JS_KEY = API_K[1];
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
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  state = {
    ip: "0.0.0.0",
    loggedin: false,
    userData: {},
    messageData: {},
    snackbar: false,
    stripe: null,
    show: {
      homePage: true,
      mailbox: false,
      sellerPage: false,
      buyerPage: false,
      accountPage: false
    },
    currentLocation: {
      lat: 0,
      lng: 0
    },
    storeData: []
  };

  componentDidMount() {
    this.getLocation();
    const script = document.createElement("script");
    script.id = "stripe-js";
    script.src = "https://js.stripe.com/v3/";
    script.async = false;
    document.body.appendChild(script);
    if (window.Stripe) {
      this.setState({
        stripe: window.Stripe(API_K[3])
      });
    } else {
      document.querySelector("#stripe-js").addEventListener("load", () => {
        // Create Stripe instance once Stripe.js loads
        this.setState({
          stripe: window.Stripe(API_K[3])
        });
      });
    }
  }

  getLocation = () => {
    const self = this;
    axios
      .get("https://ipinfo.io?token=ce9d47e2eb3f65")
      .then(function(response) {
        // console.log("USER IP " + response.data.ip);
        const arr = response.data.loc.split(",");
        let currentLocation = self.state.currentLocation;
        currentLocation.lat = parseFloat(arr[0]);
        currentLocation.lng = parseFloat(arr[1]);
        self.setState({
          currentLocation,
          ip: response.data.ip
        });
      })
      .catch(function(error) {
        console.log("Error", error);
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

  initUserData = jsonData => {
    const self = this;
    const { cookies } = this.props;
    console.log("User Token: " + jsonData["user-token"]);
    cookies.set("AuthToken", jsonData["user-token"], { path: "/" });
    console.log("Cookie Created ");
    this.setState({ loggedin: true, userData: jsonData }, () => {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          let currentLocation = self.state.currentLocation;
          currentLocation.lat = pos.coords.latitude;
          currentLocation.lng = pos.coords.longitude;
          self.setState(
            {
              currentLocation
            },
            console.log(
              "Position",
              currentLocation,
              " State ",
              this.state.currentLocation
            )
          );
        });
      }
    });
  };

  userLogOut = () => {
    const { cookies } = this.props;
    cookies.remove("AuthToken", { path: "/" });
    window.location.reload();
  };

  initMessageData = jsonData => {
    this.setState({ messageData: jsonData });
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
  getMessageData = () => {
    return this.state.messageData;
  };
  handleStoreDelete = cardID => {
    const storeData = this.state.storeData.filter(c => c.ID !== cardID);
    this.setState({ storeData: storeData }, () => {
      const whereClause = "StoreID = '" + cardID + "'";
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
      const whereClause = "StoreID = '" + store.ID + "'";
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

  isLogged = () => {
    const { cookies } = this.props;
    const token = cookies.get("AuthToken");
    if (token !== undefined) {
      axios
        .get(serverURL + "users/isvalidusertoken/" + token)
        .then(response => {
          // If request is good...
          console.log("Result", response);
          const isLoggedIn = response.data;
          return isLoggedIn;
        })
        .catch(error => {
          console.log("error " + error);
        });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <HashRouter>
        <div>
          <CookieConsent>
            This website uses cookies to enhance the user experience.
          </CookieConsent>
          <NavBar
            onInit={this.initUserData}
            onLogOut={this.userLogOut}
            onMessageInit={this.initMessageData}
            onStoreInit={this.storeInit}
            getAuth={this.getAuthToken}
            getUser={this.getUserData}
            ip={this.state.ip}
          />
          <Route
            exact
            path="/"
            render={props => (
              <HomePage
                {...props}
                getUser={this.state.userData}
                getCoords={this.state.currentLocation}
                getLogged={this.state.loggedin}
                getMessage={this.state.messageData}
              />
            )}
          />
          <Route
            path="/sellerProfile"
            render={
              props => (
                // this.isLogged() === true ? (
                <SellerProfile
                  {...props}
                  getUser={this.getUserData}
                  onDelete={this.handleStoreDelete}
                  onDealDelete={this.handleDealDelete}
                  onDealEdit={this.handleDealEdit}
                  onDealCreate={this.handleDealAdd}
                  onCreate={this.handleStoreCreate}
                  storeData={this.state.storeData}
                />
              )
              // ) : (
              //   <Redirect
              //     to={{ pathname: "/", state: { from: props.location } }}
              //   />
              // )
            }
          />
          <Route
            path="/mailBox"
            render={
              props => (
                // this.isLogged() === true ? (
                <MailBox
                  {...props}
                  stripe={this.state.stripe}
                  getUser={this.state.userData}
                  getMessage={this.getMessageData}
                />
              )
              // ) : (
              //   <Redirect
              //     to={{ pathname: "/", state: { from: props.location } }}
              //   />
              // )
            }
          />
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
        </div>
      </HashRouter>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withCookies(App));
