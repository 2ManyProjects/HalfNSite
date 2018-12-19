import React, { Component } from "react";
import "./App.css";
//import NavBar from "./components/navBar";
//import Counters from "./components/counters";
import PropTypes from "prop-types";
import StoreCardSection from "./components/storeCardSection/index";
import TitleSection from "./components/titleSection/index";
import StoreSearch from "./components/storeSearch/index";
import Login from "./components/dialog/login";
import { withStyles } from "@material-ui/core/styles";
// import API_K from "./keys";

// const APPLICATION_ID = "06FB428D-E80E-91BC-FF1A-23DEB5E08000";
// const API_KEY = API_K;
// const serverURL =
//   "https://api.backendless.com/" + API_KEY + "/" + APPLICATION_ID + "/";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  }
});

class App extends Component {
  state = {
    maxId: 4,
    counters: [
      { id: 1, value: 0 },
      { id: 2, value: 0 },
      { id: 3, value: 0 },
      { id: 4, value: 0 }
    ],
    userData: {}
  };

  componentDidMount() {
    //make ajax calls for server
    console.log("App - Mounted");
  }

  initUserdata = jsonData => {
    this.setState({ userData: jsonData });
  };

  getAuthToken = () => {
    return this.state.userData["user-token"];
  };

  handleDelete = counterId => {
    const counters = this.state.counters.filter(c => c.id !== counterId);
    this.setState({ counters: counters });
    console.log("delete", counterId);
  };
  handleCreate = () => {
    const newId = this.state.maxId + 1;
    const counters = this.state.counters.concat({
      id: newId,
      value: 0
    });
    this.setState({ counters: counters });
    this.setState({ maxId: newId });
  };

  handleReset = () => {
    const counters = this.state.counters.map(c => {
      c.value = 0;
      return c;
    });

    this.setState({ counters });
  };

  handleIncrement = counter => {
    const counters = [...this.state.counters];
    const index = counters.indexOf(counter);
    counters[index] = { ...counter };
    counters[index].value++;

    this.setState({ counters });
  };

  handleDecrement = counter => {
    const counters = [...this.state.counters];
    const index = counters.indexOf(counter);
    counters[index] = { ...counter };
    counters[index].value--;
    if (counters[index].value >= 0) this.setState({ counters });
  };

  login = () => {
    console.log("clicked");
    return <Login />;
  };

  render() {
    console.log("App - Rendered");

    /** Call the plugin */
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Login onInit={this.initUserdata} getAuth={this.getAuthToken} />
        <TitleSection />
        {/* <NavBar
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
        </main> */}
        <StoreCardSection />
        <center>
          <StoreSearch />
        </center>
      </React.Fragment>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);