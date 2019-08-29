import React, { PureComponent } from "react";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  IconButton
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { withStyles } from "@material-ui/styles";
import WbIncandescentRoundedIcon from "@material-ui/icons/WbIncandescentRounded";
import WbIncandescentOutlinedIcon from "@material-ui/icons/WbIncandescentOutlined";
import { func, object } from "prop-types";

const useStyles = theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
});

class Header extends PureComponent {
  constructor() {
    super();
    this.state = {
      themeClaire: true
    };
  }
  handleChangeTheme = () => {
    const { currentValue } = this.state;
    this.setState({ themeClaire: !currentValue });
    if (this.props.changeTheme) {
      this.props.changeTheme(!currentValue);
    }
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
            <IconButton className={classes.menuButton}>
              <WbIncandescentOutlinedIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
    );
  };
}

Header.defaultProps = {
  changeTheme: Function.prototype
};
Header.propTypes = {
  changeTheme: func,
  // eslint-disable-next-line react/forbid-prop-types
  classes: object.isRequired
};

export default withStyles(useStyles, { withTheme: true })(Header);
