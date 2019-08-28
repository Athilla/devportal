import React, { PureComponent } from 'react';
import { AppBar, Button, Toolbar, Typography, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { withStyles } from '@material-ui/styles';
import WbIncandescentRoundedIcon from '@material-ui/icons/WbIncandescentRounded';
import WbIncandescentOutlinedIcon from '@material-ui/icons/WbIncandescentOutlined';

const useStyles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
});

class Header extends PureComponent {
  renderAppBar = () => {
    const { classes } = this.props;
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.menuButton}>
            DocumentationApi
          </Typography>
          <Typography variant="h6" className={classes.title}>
            Mon autre documentation
          </Typography>
        </Toolbar>
      </AppBar>
    );
  };
  render = () => {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.menuButton}>
              DocumentationApi
            </Typography>
            <Typography variant="h6" className={classes.title}>
              DocumentationApi Title
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  };
}

export default withStyles(useStyles, { withTheme: true })(Header);
