import React from "react";
import { i18n, withTranslation } from "../i18n";
import axios from "axios";
import { buildApiUrl } from "../utils/api";
import { withStyles } from '@material-ui/core/styles';

import { Paper, Typography, LinearProgress } from '@material-ui/core';

const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`
  },
  successMsg: {},
  errorMsg: {
    color: "red"
  }
});

class ConfirmEmail extends React.Component {
  state = {
    loading: true,
    successMsg: "",
    errorMsg: ""
  };

  static async getInitialProps({ query }) {
    return {
      query,
      namespacesRequired: ["common"]
    };
  }

  componentDidMount() {
    const { t, query } = this.props;
    const key = query["k"];

    if (!key) {
      this.setState({
        errorMsg: t("confirm_email.invalid_key"),
        loading: false
      });
      return;
    }

    const dataSend = { key };

    axios
      .post(buildApiUrl("/auth/registration/verify-email/"), dataSend, {
        headers: { "Accept-Language": i18n.language }
      })
      .then(response => {
        this.setState({
          errorMsg: "",
          successMsg: t("confirm_email.success_msg")
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({
          errorMsg: t("confirm_email.error_msg"),
          successMsg: ""
        });
      })
      .then(() => {
        this.setState({
          loading: false
        });
      });
  }

  render() {
    const { classes } = this.props;
    const { loading, successMsg, errorMsg } = this.state;

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          {loading && <LinearProgress />}
          <Typography className={classes.successMsg}>{successMsg}</Typography>
          <Typography className={classes.errorMsg}>{errorMsg}</Typography>
        </Paper>
      </main>
    );
  }
}

ConfirmEmail = withStyles(styles)(ConfirmEmail);
ConfirmEmail = withTranslation()(ConfirmEmail);

export default ConfirmEmail;
