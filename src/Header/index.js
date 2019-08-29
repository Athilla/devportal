import React, { PureComponent } from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { withStyles } from "@material-ui/styles";
import WbIncandescentRoundedIcon from "@material-ui/icons/WbIncandescentRounded";
import WbIncandescentOutlinedIcon from "@material-ui/icons/WbIncandescentOutlined";
import { func, object } from "prop-types";

const useStyles = theme => ({
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
    const { themeClaire } = this.state;
    console.log(!themeClaire);
    this.setState({ themeClaire: !themeClaire });
    this.props.changeTheme(!themeClaire);
  };

  render = () => {
    const { classes } = this.props;
    const { themeClaire } = this.state;
    return (
      <AppBar id="Appbar">
        <Toolbar>
          <Typography variant="h6" className={classes.menuButton}>
            DocumentationApi
          </Typography>
          <Typography variant="h6" className={classes.title}>
            DocumentationApi Title
          </Typography>
          <Button
            className={classes.menuButton}
            onClick={this.handleChangeTheme}
          >
            {themeClaire && <WbIncandescentOutlinedIcon />}
            {!themeClaire && <WbIncandescentRoundedIcon />}
          </Button>
        </Toolbar>
      </AppBar>
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
