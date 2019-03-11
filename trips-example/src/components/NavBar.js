import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  grow: {
    flexGrow: 1,
  },
  root: {
    position: "relative",
    marginLeft: 0,
    color: "white",
  },
  select: {
    color: "white",
  },
  selectControl: {
    margin: theme.spacing.unit,
    minWidth: 180,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

const NavBar = ({ classes }) => {
    return(
        <AppBar position="static">
            <Toolbar>
                <Typography variant="title" color="inherit">
                    Grabbito Vacation Destinations
                </Typography>
                <div className={classes.grow} />
            </Toolbar>
        </AppBar>
    );
}

export default withStyles(styles)(NavBar);
