import React from "react";
import ReactDOM from "react-dom";

const mapStyles = {
  map: {
    position: "absolute",
    width: "100%",
    height: "100%"
  }
};
export class CurrentLocation extends React.Component {
  state = {
    currentLocation: { lat: 0, lng: 0 },
    places: [],
    updated: false
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
    if (prevState.currentLocation !== this.state.currentLocation) {
      this.recenterMap();
    }
  }

  recenterMap() {
    this.setState({ updated: false });
    const map = this.map;
    const current = this.state.currentLocation;

    const google = this.props.google;
    const maps = google.maps;

    if (map) {
      let center = new maps.LatLng(current.lat, current.lng);
      map.panTo(center);
    }
  }

  componentDidMount() {
    if (this.props.centerAroundCurrentLocation) {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const coords = pos.coords;
          this.setState({
            currentLocation: {
              lat: coords.latitude,
              lng: coords.longitude
            }
          });
        });
      }
    }
    this.loadMap();
  }

  loadMap() {
    if (this.props && this.props.google) {
      // checks if google is available
      const { google } = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;

      // reference to the actual DOM element
      const node = ReactDOM.findDOMNode(mapRef);

      let { zoom } = this.props;
      const { lat, lng } = this.state.currentLocation;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign(
        {},
        {
          center: center,
          zoom: zoom
        }
      );
      this.map = new maps.Map(node, mapConfig);
    }
  }
  componentWillReceiveProps(props) {
    const { address } = this.props;
    if (props.address !== address) {
      this.setState({ updated: false });
    }
    this.onReady();
  }

  onReady = () => {
    if (this.props.address.length > 2 && this.state.updated === false) {
      this.setState({ updated: true });
      const { google } = this.props;
      const service = new google.maps.places.PlacesService(this.map);

      // Specify location, radius and place types for your Places API search.
      const request = {
        location: this.state.currentLocation,
        name: this.props.address,
        radius: "5000",
        fields: [
          "place_id",
          "formatted_address",
          "name",
          "rating",
          "opening_hours"
        ]
      };

      service.nearbySearch(request, (results, status) => {
        console.log("results", results);
        console.log("status", status);
        if (status === google.maps.places.PlacesServiceStatus.OK)
          this.setState({ places: results }, () => {
            this.props.Found(this.state.places);
          });
      });
    }
  };

  renderChildren() {
    const { children } = this.props;

    if (!children) return;

    return React.Children.map(children, c => {
      if (!c) return;
      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.state.currentLocation
      });
    });
  }

  constructor(props) {
    super(props);

    const { lat, lng } = this.props.initialCenter;
    this.state = {
      currentLocation: {
        lat: lat,
        lng: lng
      }
    };
  }

  render() {
    const style = Object.assign({}, mapStyles.map);
    return (
      <div>
        <div style={style} ref="map">
          Loading map...
        </div>
        {this.renderChildren()}
      </div>
    );
  }
}
export default CurrentLocation;

CurrentLocation.defaultProps = {
  zoom: 14,
  initialCenter: {
    lat: -1.2884,
    lng: 36.8233
  },
  centerAroundCurrentLocation: false,
  visible: true
};
