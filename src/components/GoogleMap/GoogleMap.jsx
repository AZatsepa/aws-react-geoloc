import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import { API } from "aws-amplify";
import Marker from "./Marker";

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

  async componentDidMount() {
    try {
      this.webSocket.onmessage = (event) => {
        const updatedLocation = JSON.parse(event.data);
        this.setState({
          locations: [...this.locationsForUpdate(updatedLocation), JSON.parse(event.data)],
        });
      };

      await this.fillLocations();
    } catch (error) {
      console.log(error);
    }
  }

  componentWillUnmount() {
    this.webSocket.close();
  }

  locationsForUpdate = (loc) => {
    const { locations } = this.state;
    return locations.filter((location) => loc.id !== location.id);
  }

  // eslint-disable-next-line consistent-return
  getLocations = async () => {
    try {
      return await API.get("AWS-React-Geoloc", "/locations", {});
    } catch (error) {
      console.error(error);
    }
  };

  fillLocations = async () => {
    const allLocations = await this.getLocations();
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
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
              <Marker
                lat={currentLocation.lat}
                lng={currentLocation.lng}
              />
              { locations.map((location) => (
                <Marker key={location.id} lat={location.latitude} lng={location.longitude} />
              ))}
            </GoogleMapReact>
          )
        }
      </div>
    );
  }
}

export default GoogleMap;
