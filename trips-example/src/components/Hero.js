import React from 'react'

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const styles = theme => ({
  heroContainer: {
    position: 'relative',
  },
  hero: {
    width: '100%',
    paddingBottom: '38%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  paper: {
    padding: theme.spacing.unit * 2,
    height: '100%',
    color: theme.palette.text.secondary,
  },
  fullHeight: {
    position: 'absolute',
    top:0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 15,
  },
});

const Hero = ( { classes, imageUri, titleText } ) => {
  return(
    <div className={classes.heroContainer}>
      <div 
        className={classes.hero} 
        style={{backgroundImage: `url(${imageUri})`}} />
      <Grid 
        container 
        justify='flex-start' 
        alignItems='flex-end' 
        className={classes.fullHeight} >
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <Typography variant='title' color='default' >
              {titleText}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default withStyles(styles)(Hero);
