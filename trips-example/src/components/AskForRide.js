import * as GrabID from '@grab-id/grab-id-client/dist/bundle';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import green from '@material-ui/core/colors/green';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';

import classNames from 'classnames';
import React, {Component} from 'react';

import {getDestination} from '../repo/DestinationsRepo';
import pickupRepo from '../repo/PickupLocationsRepo';
import Hero from './Hero';
import utils from '../utils';
import { clientConfig } from '../config';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  cssRoot: {
    color: '0xfff',
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  paper: {
    marginTop: 25,
  },
  card: {
    marginTop: 20,
    padding: 8,
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
});

class AskForRide extends Component {
  static getDerivedStateFromProps(props, state) {
    if (state && state.destination && state.destination.id !== props.propertyId) {
      return {
        destination: getDestination(props.propertyId),
      };
    }
    return null;
  }

  constructor({propertyId, language}) {
    super();

    this.state = {
      destination: getDestination(propertyId),
    };

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

    this.login = this.login.bind(this);
    this.onAirportChanged = this.onAirportChanged.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.propertyId !== prevProps.propertyId) {
      this.setState({
        destination: getDestination(this.props.propertyId),
      });
    }
  }

  login() {
    this.grabClient.getOpenIdConfiguration()
      .then(() => {
        this.grabClient.makeAuthorizationRequest(this.props.finishUri);
      })
      .catch(error => alert(error.toString()));
  };

  onAirportChanged(e) {
    this.setState({
      selectedAirportId: e.target.value,
    });
  }

  render() {
    const {classes, date} = this.props;

    return(
      <React.Fragment>
        <Hero imageUri='/images/hero-car1.jpg' titleText='Vacation is confirmed' />
        <Grid container justify='center' alignItems='center' className={classes.paper}>
          <Grid item xs={6}>
            <Paper className={classes.card} >
              <Typography gutterBottom variant='subheading' component='p'>
                Your vacation at {this.state.destination.title} on {utils.formatDate(date)} is confirmed.
              </Typography>
              <Typography gutterBottom variant="subheading" color='textSecondary' component="p">
                Do you want to book a ride from airport to {this.state.destination.title} with Grab?
              </Typography>
              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Select airport you will be arriving to on {utils.formatDate(date)}:</FormLabel>
                <RadioGroup
                  aria-label="Airport"
                  name="airport1"
                  className={classes.group}
                  value={this.state.selectedAirportId}
                  onChange={this.onAirportChanged}
                >
                  {pickupRepo.filterPickupLocations(this.state.destination.id).map(location => 
                    <FormControlLabel key={location.id} value={location.id} control={<Radio />} label={location.name} />
                  )}
                </RadioGroup>
              </FormControl>
              <Button
                variant = 'contained'
                color = 'primary'
                className={classNames(classes.margin, classes.cssRoot)}
                onClick={this.login}
                disabled={!this.state.selectedAirportId }
              >
                <b>Login with Grab</b>
              </Button>
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

export default withStyles(styles)(AskForRide);
