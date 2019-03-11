import * as GrabID from '@grab-id/grab-id-client/dist/bundle';

import React, { Component } from 'react';
import { getDestination } from '../repo/DestinationsRepo';
import Hero from './Hero';
import { clientConfig } from '../config';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    height: '100%',
    color: theme.palette.text.secondary,
  },
  card: {
    marginTop: 20,
    padding: 8,
  },
});

class ConfirmRide extends Component {
  static getDerivedStateFromProps(props, state) {
    if (state && state.destination && state.destination.id !== props.propertyId) {
      return {
        destination: getDestination(props.propertyId),
      };
    }
    return null;
  }
  constructor ({date, propertyId, onGoHome}) {
    super();
    
    const destination = getDestination(propertyId);
    this.state ={destination};

    let appConfig = {
      clientId: clientConfig.clientId,
      redirectUri: `${window.location.origin}/token.html`,
      scope: clientConfig.scopes.join(' '),
      acrValues: {
        service: 'PASSENGER',
        consent_ctx: 'country=sg',
      }
    };

    this.grabClient = new GrabID(clientConfig.openIdUrl, appConfig);

    this.grabClient.getOpenIdConfiguration()
      .then(() => {
        this.grabClient.makeTokenRequest()
          .then(() => {
            let tokenResult = GrabID.getResult();
            window.fetch("https://" + clientConfig.grabApiDomain + "/grabid/v1/oauth2/userinfo", {
              method: 'GET',
              headers: {
                'Accept-Content': 'application/json; charset=utf-8',
                Authorization: "Bearer " + tokenResult.accessToken,
              },
              mode: 'cors',
            })
            .then((response) => { 
              response.json().then((userInfo) => {
                this.setState({
                  userName: userInfo.name,
                  userEmail: userInfo.email,
                });
              });
            })
          })
      })
  }
  
  render() {
    const {classes} = this.props;
    return(
      <React.Fragment>
        <Hero imageUri='/images/grab-food.jpg' titleText='Happy travel with Grab' />
        <Grid container justify='center' alignItems='center' className={classes.paper}>
          <Grid item xs={6}>
            <Paper className={classes.card}>
              <Typography gutterBottom variant="headline" component="p">
                Your ride to {this.state.destination.title} is confirmed!
              </Typography>
              <Typography gutterBottom variant="subheading" component="p">
                Name: {this.state.userName}
              </Typography>
              <Typography gutterBottom variant="subheading" component="p">
                Email: {this.state.userEmail}
              </Typography>
              <Button color='secondary' onClick={this.props.onGoHome}>
                Return Home
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ConfirmRide);
