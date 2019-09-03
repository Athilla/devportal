import React, { PureComponent } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import WbIncandescentRoundedIcon from '@material-ui/icons/WbIncandescentRounded';
import WbIncandescentOutlinedIcon from '@material-ui/icons/WbIncandescentOutlined';
import { func, object } from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { ChevronLeft, ChevronRight, SaveAlt, TrendingUp, Widgets } from '@material-ui/icons';

const drawerWidth = 300;

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
  appFrame: {
    height: '430',
    zIndex: 1,
    aOverflow: 'hidden',
    position: 'static',
display: 'flex',
    width: '100%',
 flexDirection: 'column',
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    width: drawerWidth,
    height: '100%',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  },
});
class Header extends PureComponent {
  constructor() {
    super();
    this.state = {
      themeClaire: true,
      open: false,
    };
  }
  handleChangeTheme = () => {
    const { themeClaire } = this.state;
    console.log(!themeClaire);
    this.setState({ themeClaire: !themeClaire });
    this.props.changeTheme(!themeClaire);
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render = () => {
    const { classes, theme } = this.props;
    const { open, themeClaire } = this.state;
    return (
      <div className={classes.appFrame}>
        <AppBar
          id="AppBar"
          position="static"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar disableGutters={!open}>
            <IconButton
              className={classNames(classes.menuButton, open && classes.hide)}
              color="inherit"
              aria-label="Menu"
              onClick={this.handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit">
              CNovaPay - Documentation
            </Typography>
          </Toolbar>
        </AppBar>
        <SwipeableDrawer
          variant="persistent"
          anchor="left"
          open={open}
          onOpen={this.handleDrawerOpen}
          onClose={this.handleDrawerClose}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div
            className={classes.drawerHeader}
            role="button"
            onClick={this.handleDrawerClose}
            onKeyDown={this.handleDrawerClose}
          >
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          </div>
          <List>
            <Divider />
            <Link to="/ApiDocumentation">
              <ListItem button onClick={this.handleDrawerClose}>
                <ListItemIcon>
                  <Widgets />
                </ListItemIcon>
                <ListItemText primary="Payment Gateway Api" />
              </ListItem>
            </Link>
            <Link to="/Payment_saas_integration">
              <ListItem button onClick={this.handleDrawerClose}>
                <ListItemIcon>
                  <Widgets />
                </ListItemIcon>
                <ListItemText primary="Payment saas integration" />
              </ListItem>
            </Link>
          </List>
          <Divider />
        </SwipeableDrawer>
      </div>
    );
  };
}

Header.defaultProps = {
  changeTheme: Function.prototype,
};
Header.propTypes = {
  changeTheme: func,
  // eslint-disable-next-line react/forbid-prop-types
  classes: object.isRequired,
};

export default withStyles(useStyles, { withTheme: true })(Header);
