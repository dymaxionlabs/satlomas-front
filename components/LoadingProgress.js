import React from "react";
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

const styles = theme => ({
  progressContainer: {
    background: "#222",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  progress: {
    margin: theme.spacing(2),
    color: "#fff"
  }
});

const LoadingProgress = ({ classes }) => (
  <div className={classes.progressContainer}>
    <CircularProgress className={classes.progress} />
  </div>
);

export default withStyles(styles)(LoadingProgress);
