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
import { Marker, GoogleApiWrapper } from "google-maps-react";
import CurrentLocation from "./Map";
import InfoWindowEx from "./InfoWind";
import Api_Key from "./../../keys";
let fill = 0;
export class SellerProfile extends Component {
  constructor(props) {
    super(props);
    this.onMarkerMounted = element => {
      if (!element) {
        this.setState(prevState => ({
          markerObjects: []
        }));
      } else {
        this.setState(prevState => ({
          markerObjects: [...prevState.markerObjects, element.marker]
        }));
      }
    };
  }

  state = {
    storeData: [],
    open: false,
    ID: "",
    address: "",
    buyer: "",
    name: "",
    seller: "",
    isNew: false,
    dealProgression: 0,
    storeDeals: [{}],
    query: "",
    imageResource: 0,
    places: [],
    markerObjects: [],
    showingInfoWindow: false, //Hides or the shows the infoWindow
    activeMarker: {}, //Shows the active marker upon click
    selectedPlace: { name: "", data: { vicinity: "", place_id: "" } } //Shows the infoWindow to the selected place upon a marker
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
      query: "",
      imageResource: 0,
      places: [],
      markerObjects: [],
      showingInfoWindow: false, //Hides or the shows the infoWindow
      activeMarker: {}, //Shows the active marker upon click
      selectedPlace: { name: "", data: { vicinity: "", place_id: "" } }, //Shows the infoWindow to the selected place upon a marker
      Errors: {
        address: ""
      }
    });
  };

  fillPlaces = results => {
    this.setState({ places: results });
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
    this.setState({
      address: e.target.value,
      places: [],
      markerObjects: [],
      showingInfoWindow: false, //Hides or the shows the infoWindow
      activeMarker: {}
    });
  };

  _handleKeyPress = e => {
    if (e.key === "Enter") {
      this.setState({ address: e.target.value, query: e.target.value });
    }
  };

  handleRegister = () => {
    const data = this.state.selectedPlace.data;
    const storeData = {
      StoreID: data.place_id,
      Name: data.name
    };
    this.props.onCreate(storeData, data);
    this.handleClose();
  };

  handleOpen = () => {
    this.resetStateValues();
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  getDisplayInfo = () => {
    if (this.state.selectedPlace !== "undefined") {
      return (
        <center>
          <Typography>Name: {this.state.selectedPlace.name}</Typography>
          <Typography>
            Address: {this.state.selectedPlace.data.vicinity}
          </Typography>
          <Typography>
            Place ID: {this.state.selectedPlace.data.place_id}
          </Typography>
        </center>
      );
    }
  };

  componentWillReceiveProps(props) {
    const { storeData } = this.props;
    if (props.storeData !== storeData || fill === 1) {
      fill = fill + 1;
      const sortedArray = storeData.sort(function(a, b) {
        if (a.name < b.name) return -1;
        else if (a.name > b.name) return 1;
        return 0;
      });
      this.setState({ storeData: sortedArray });
    }
  }

  render() {
    const {
      storeData,
      onDealDelete,
      onDealEdit,
      onDelete,
      onDealCreate
    } = this.props;
    const data = this.state.places;
    return (
      <span>
        <Button onClick={this.handleOpen} variant="contained" color="primary">
          Add Store
        </Button>
        {this.state.storeData.map(storecard => (
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
              onKeyPress={this._handleKeyPress}
              required={true}
              fullWidth
            />
            <CurrentLocation
              centerAroundCurrentLocation
              google={this.props.google}
              address={this.state.query}
              Found={this.fillPlaces}
            >
              {data.map(item => (
                <Marker
                  onClick={this.onMarkerClick}
                  ref={this.onMarkerMounted}
                  data={item}
                  key={item.place_id}
                  title={item.name}
                  name={item.name}
                  position={{
                    lat: item.geometry.location.lat(),
                    lng: item.geometry.location.lng()
                  }}
                />
              ))}
              <InfoWindowEx
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
              >
                <div>
                  {this.getDisplayInfo()}

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleRegister}
                  >
                    Register
                  </Button>
                  <Button
                    onClick={() => {
                      this.handleClose();
                    }}
                    color="secondary"
                  >
                    Cancel
                  </Button>
                </div>
              </InfoWindowEx>
            </CurrentLocation>
          </DialogContent>
          <DialogActions />
        </Dialog>
      </span>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: Api_Key[2]
})(SellerProfile);
