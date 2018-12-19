import React, { Component } from "react";
import "./App.css";
import PropTypes from "prop-types";
import HomePage from "./components/homePage/index";
import Login from "./components/dialog/login";
import { withStyles } from "@material-ui/core/styles";
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
    userData: {}
  };

  componentDidMount() {
    console.log("App - Mounted");
  }

  initUserdata = jsonData => {
    this.setState({ userData: jsonData });
  };

  getAuthToken = () => {
    return this.state.userData["user-token"];
  };

  render() {
    console.log("App - Rendered");

    /** Call the plugin */
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Login onInit={this.initUserdata} getAuth={this.getAuthToken} />
        <HomePage />
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
