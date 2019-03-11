import React from 'react';
import { getDestination } from '../repo/DestinationsRepo';
import Hero from './Hero';
import utils from '../utils';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({});

const ConfirmBooking = ({date, propertyId, onConfirm, onGoHome, classes}) => {
  const destination = getDestination(propertyId);

  return(
    <React.Fragment>
      <Hero imageUri='/images/adventure-beach-blue.jpg' titleText={`Confirm booking ${destination.title}`} />
      <div style={{flexGrow: 1}}>
        <Grid container justify='center' style={{padding: 24}}>
          <Grid item xs={6}>
            <Card>
              <CardMedia style={{height: 0, paddingTop: '56.25%'}}
                image={destination.imageUri}
                title={destination.title}
              />
              <CardContent>
                <Typography gutterBottom variant="headline" component="h2">
                  {destination.title}
                </Typography>
                <Typography component="p">
                  {destination.description}
                </Typography>
                <Typography component="p">
                  Status: Available on {utils.formatDate(date)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button color="primary" onClick={onConfirm}>
                  Book this property
                </Button>
                <Button color="secondary" onClick={onGoHome}>
                  Cancel
                </Button>
              </CardActions>
            </Card>            
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  )
}

export default withStyles(styles)(ConfirmBooking);
