import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch
} from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import React, { Component, Fragment } from "react";
import Header from "../Header";
import Redoc from "../Redoc";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";

const styles = theme => ({
  root: {
    display: "flex",
    flexGrow: 1,

    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  }
});

class App extends Component {
  handleChangeTheme = themeClaire => {
    // console.log(this.props.theme);
    if (themeClaire) {
      //console.log("Theme Claire ");
      this.props.theme.palette.type = "light";
    } else {
      //console.log("theme Foncé");
      this.props.theme.palette.type = "dark";
    }
  };

  render = () => {
    return (
      <div className="App">
        <Router>
          <Fragment>
            <CssBaseline />
            <Header changeTheme={this.handleChangeTheme} />
            <Toolbar id="back-to-top-anchor" />
            <Container>
              <Switch>
                <Route path="/Documentation" component={Redoc} />
                <Redirect to="/Documentation" />
              </Switch>
            </Container>
          </Fragment>
        </Router>
      </div>
    );
  };
  renderb = () => {
    return (
      <div className="App">
        <Fragment>
          <Header />
          <Grid container spacing={8}>
            <Grid item xs={12} />
          </Grid>
        </Fragment>
      </div>
    );
  };
}

export default withStyles(styles, { withTheme: true })(App);
