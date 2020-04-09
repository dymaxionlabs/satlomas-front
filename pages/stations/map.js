import axios from "axios";
import dynamic from "next/dynamic";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { Component } from "react";
import LoadingProgress from "../../components/LoadingProgress";
import MapDrawer, { drawerWidth } from "../../components/MapDrawer";
import { withStyles } from "@material-ui/core/styles";
import { withNamespaces } from "../../i18n";
import { buildApiUrl } from "../../utils/api";
import { withAuthSync } from "../../utils/auth";

const styles = (_theme) => ({
  map: {
    width: `calc(100vw - ${drawerWidth}px)`,
    height: "100vh",
    marginLeft: drawerWidth,
    flex: 1,
  },
});

const mapboxStyle = "mapbox.streets";

// const sentinelModifiedAttribution =
//   'Contains modified <a href="http://www.esa.int/Our_Activities/Observing_the_Earth/Copernicus">Copernicus</a> Sentinel data 2019, processed by ESA.';
// const dymaxionAttribution = "&copy; Dymaxion Labs 2019";

// Dynamically load TrialMap component as it only works on browser
const Map = dynamic(() => import("../../components/Map"), {
  ssr: false,
  loadingProgress: <LoadingProgress />,
});

class StationsMap extends Component {
  state = {
    map: null,
    bounds: null,
    viewport: {
      center: [-12.046373, -76.542755],
      zoom: 10,
    },
    stations: [],
    selectedStation: null,
  };

  static async getInitialProps({ query }) {
    return {
      query,
      namespacesRequired: ["common"],
    };
  }

  async fetchStations() {
    const { token } = this.props;
    const headers = token ? { Authorization: token } : {};

    const response = await axios.get(buildApiUrl(`/stations/`), {
      headers: headers,
    });
    const stations = response.data || [];

    this.setState({ stations });
  }

  async componentDidMount() {
    await this.fetchStations();
  }

  handleMapViewportChanged = (viewport) => {
    this.setState({ viewport });
  };

  handleStationSelect = (station) => {
    this.setState({ selectedStation: station });
  };

  render() {
    const { classes } = this.props;
    const { viewport, bounds, stations, selectedStation } = this.state;

    const stationPoints = stations.map((s) => [s.lat, s.lon]);

    return (
      <div className="index">
        <Head>
          <title>Stations Map - GeoLomas Platform</title>
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/favicon.ico"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
        </Head>
        <MapDrawer
          stations={stations}
          selectedStation={selectedStation}
          onStationSelect={this.handleStationSelect}
          onMenuClick={this.handleMenuClick}
        />
        <Map
          className={classes.map}
          bounds={bounds}
          boundPoints={stationPoints}
          viewport={viewport}
          onViewportChanged={this.handleMapViewportChanged}
          mapboxStyle={mapboxStyle}
          markers={stations}
        />
      </div>
    );
  }
}

StationsMap.propTypes = {
  t: PropTypes.func.isRequired,
};

StationsMap = withNamespaces()(StationsMap);
StationsMap = withStyles(styles)(StationsMap);
StationsMap = withAuthSync(StationsMap, { redirect: false });

export default StationsMap;
