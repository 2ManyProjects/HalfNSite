import React, { Component } from "react";
import Cards from "./profileStoreCard";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FormErrors } from "./../dialog/FormErrors";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import CurrentLocation from "./Map";

const mapStyles = {
  width: "100%",
  height: "100%"
};

export class SellerProfile extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    open: false,
    ID: "",
    address: "",
    buyer: "",
    name: "",
    seller: "",
    isNew: false,
    dealProgression: 0,
    storeDeals: [{}],
    imageResource: 0,
    showingInfoWindow: false, //Hides or the shows the infoWindow
    activeMarker: {}, //Shows the active marker upon click
    selectedPlace: {} //Shows the infoWindow to the selected place upon a marker
  };

  resetStateValues = () => {
    this.setState({
      open: true,
      ID: "",
      address: "",
      buyer: "",
      name: "",
      seller: "",
      isNew: false,
      dealProgression: 0,
      storeDeals: [{}],
      imageResource: 0,
      Errors: {
        address: ""
      }
    });
  };

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  changeAddress = e => {
    this.setState({ address: e.target.value });
  };

  handleOpen = () => {
    this.resetStateValues();
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const {
      storeData,
      onDealDelete,
      onDealEdit,
      onDelete,
      onDealCreate,
      onCreate
    } = this.props;
    return (
      <span>
        <Button onClick={this.handleOpen} variant="contained" color="primary">
          Add Store
        </Button>
        {storeData.map(storecard => (
          <Cards
            key={storecard.ID}
            onDelete={onDelete}
            onDealCreate={onDealCreate}
            onDealDelete={onDealDelete}
            onDealEdit={onDealEdit}
            storecard={storecard}
          />
        ))}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          fullScreen
        >
          <DialogTitle id="form-dialog-title">Add Store</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Something should probably go here, tag line maybe?
            </DialogContentText>

            <div className="panel panel-default warning">
              <FormErrors formErrors={this.state.Errors} />
            </div>
            <TextField
              autoFocus
              margin="dense"
              id="address"
              value={this.state.address}
              label="Store Name"
              type="text"
              onChange={this.changeAddress}
              required={true}
              fullWidth
            />
            <CurrentLocation
              centerAroundCurrentLocation
              google={this.props.google}
            >
              <Marker onClick={this.onMarkerClick} name={"current location"} />
              <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
                onClose={this.onClose}
              >
                <div>
                  <h4>{this.state.selectedPlace.name}</h4>
                </div>
              </InfoWindow>
            </CurrentLocation>
            <Button
              variant="contained"
              color="primary"
              //onClick={this.handleClick}
            >
              Register
            </Button>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
          </DialogContent>
          <DialogActions />
        </Dialog>
      </span>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyApfIryWW-NDUkgpTpKwEsy5OsR1GsaGQo"
})(SellerProfile);
