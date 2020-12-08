import React, { Component } from "react";
import { shape } from "prop-types";
import GoogleMapReact from "google-map-react";
import { API, Auth } from "aws-amplify";
import MyMarker from "./MyMarker";
import Marker from "./Marker";
import AlertContext from "../context/AlertContext";

const DEFAULT_LOCATION = { lat: 59.95, lng: 30.33 };

class GoogleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLocation: DEFAULT_LOCATION,
      locations: [],
    };
    this.webSocket = new WebSocket(process.env.REACT_APP_SOCKETS_URL);
  }

  componentDidMount = async () => {
    const { setError } = this.context;
    try {
      await this.fillLocations();
      this.startWebSocket();
    } catch (error) {
      setError(error.message);
    }
  }

  componentWillUnmount() {
    this.webSocket.close();
  }

  locationsForUpdate = (loc) => {
    const { locations } = this.state;
    return locations.filter((location) => loc.username !== location.username);
  }

  // eslint-disable-next-line consistent-return
  getLocations = async () => {
    const { setError } = this.context;
    const { auth } = this.props;
    try {
      const token = (await Auth.currentSession()).getIdToken().getJwtToken();
      const locations = await API.get("AWS-React-Geoloc", "/locations", {
        headers: {
          Authorization: token,
        },
      });
      return locations.filter((location) => location.username !== auth.user?.username);
    } catch (error) {
      setError(error.message);
    }
  };

  saveCoordinate = async (lat, lng) => {
    const { username } = await Auth.currentUserInfo();
    if (!this.isWebsocketOpen()) return;
    this.webSocket.send(
      JSON.stringify({
        message: {
          username,
          latitude: lat,
          longitude: lng,
        },
        action: "save_location",
      }),
    );
  }

  startWebSocket = () => {
    const { auth } = this.props;
    this.webSocket.onmessage = (event) => {
      const updatedLocation = JSON.parse(event.data);

      if (!auth.user) return;
      if (updatedLocation.message || updatedLocation.username === auth.user.username) return;
      this.setState({
        locations: [...this.locationsForUpdate(updatedLocation), updatedLocation],
      });
    };
  }

  isWebsocketOpen = () => this.webSocket.readyState === WebSocket.OPEN;

  fillLocations = async () => {
    const allLocations = await this.getLocations();
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      this.saveCoordinate(lat, lng);
      this.setState({
        currentLocation: { lat, lng },
        locations: allLocations,
      });
    });
  }

  render() {
    const { currentLocation, locations } = this.state;
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "100vh", width: "100%" }}>
        {
          currentLocation
          && (
            <GoogleMapReact
              bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_API_KEY }}
              defaultCenter={DEFAULT_LOCATION}
              center={currentLocation}
              defaultZoom={10}
              yesIWantToUseGoogleMapApiInternals
              options={{
                gestureHandling: "greedy",
              }}
            >
              <MyMarker
                lat={currentLocation.lat}
                lng={currentLocation.lng}
              />
              { locations.map((location) => (
                <Marker key={location.username} lat={location.latitude} lng={location.longitude} />
              ))}
            </GoogleMapReact>
          )
        }
      </div>
    );
  }
}

GoogleMap.contextType = AlertContext;

GoogleMap.propTypes = {
  auth: shape({}).isRequired,
};

export default GoogleMap;
