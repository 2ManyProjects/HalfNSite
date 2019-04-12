import React, { Component } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

class Suggestions extends Component {
  constructor(props) {
    super(props);
    this.state = { results: [], anchorEl: null };
  }
  componentWillReceiveProps(props) {
    if (props.results !== undefined && props.results !== this.state.results) {
      this.setState({
        results: props.results,
        anchorEl: props.anchor
      });
    }
  }
  handleSelect = name => {
    const self = this;
    this.setState({ anchorEl: null }, () => {
      self.props.select(name);
    });
  };
  handleMenuClose = () => {
    const self = this;
    this.setState({ anchorEl: null });
  };
  render() {
    const { anchorEl } = this.state;
    const isMenuOpen = Boolean(anchorEl);
    // const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    let tempArr = [];
    this.state.results.map(a => tempArr.push(a.Name));
    const options = Array.from(new Set(tempArr)).map(r => (
      <MenuItem key={Math.random()} onClick={() => this.handleSelect(r)}>
        {r}
      </MenuItem>
    ));
    const filtered = options.filter(function(elem, pos, arr) {
      return arr.indexOf(elem) === pos;
    });

    const renderMenu = (
      <Menu
        anchorEl={this.state.anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: -40, horizontal: 160 }}
        open={isMenuOpen}
        disableAutoFocus
        disableEnforceFocus
        onClose={this.handleMenuClose}
      >
        {filtered}
      </Menu>
    );

    // const renderMobileMenu = (
    //   <Menu
    //     anchorEl={mobileMoreAnchorEl}
    //     anchorOrigin={{ vertical: "top", horizontal: "right" }}
    //     transformOrigin={{ vertical: "top", horizontal: "right" }}
    //     open={isMobileMenuOpen}
    //     onClose={this.handleMobileMenuClose}
    //   >
    //     {filtered}
    //   </Menu>
    // );

    return <div>{filtered}</div>;
    // return <div>{renderMenu}</div>;
  }
}

export default Suggestions;
