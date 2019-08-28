import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import React, { Component, Fragment } from 'react';
import Header from '../Header';
import Redoc from '../Redoc';

const styles = {
  root: {
    flexGrow: 1,
  },
};

class App extends Component {
  rendera = () => {
    return (
      <div className="App">
        <Router>
          <Fragment>
            <Header />
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <Switch>
                  <Route path="/Documentation" component={Redoc} />
                  <Redirect to="/Documentation" />
                </Switch>
              </Grid>
            </Grid>
          </Fragment>
        </Router>
      </div>
    );
  };
  render = () => {
    return (
      <div className="App">
        <Fragment>
          <Header />
          <Grid container spacing={8}>
            <Grid item xs={12}></Grid>
          </Grid>
        </Fragment>
      </div>
    );
  };
}

export default withStyles(styles, { withTheme: true })(App);
