import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import React, { Component, Fragment } from 'react';
import Header from '../Header';
import Redoc from '../Redoc';
import Md from '../Md';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';

const classes = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    width: '100%',
    maxWidth: '100%',
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
});

class App extends Component {
  handleChangeTheme = themeClaire => {
    // console.log(this.props.theme);
    if (themeClaire) {
      //console.log("Theme Claire ");
      this.props.theme.palette.type = 'light';
    } else {
      //console.log("theme Foncé");
      this.props.theme.palette.type = 'dark';
    }
  };

  render = () => {
    return (
      <div className="{classes.root}">
        <Router>
          <Fragment>
            <CssBaseline />
            <Header changeTheme={this.handleChangeTheme} />
            <Toolbar id="back-to-top-anchor" />
            <Container maxWidth="false">
              <Switch>
                <Route path="/ApiDocumentation" component={Redoc} />
                <Route path="/Payment_saas_integration" component={Md} />
                <Redirect to="/Payment_saas_integration" />
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

export default withStyles(classes, { withTheme: true })(App);
