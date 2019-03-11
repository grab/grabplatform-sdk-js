import React, {Component} from 'react'
import memoizeOne from 'memoize-one';
import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import {filterDestinations} from '../repo/DestinationsRepo';

import Destination from './Destination';
import Hero from './Hero';

const styles = theme => ({
  dateSelect: {
    padding: 24,
    width: 200,
  },
});

class DestinationList extends Component {
  static getDerivedStateFromProps(props, state) {
    if (props.date && props.date !== state.selectedDate) {
      return {
        selectedDate: props.date,
      };
    }
    return null;
  }

  constructor({date}) {
    super();

    this.state = {
      destinations: [],
      selectedDate: date || this.getTodayFormatted(),
    };

    this.onSearchInputChange = this.onSearchInputChange.bind(this);
  }

  componentDidMount() {
    this.filterDestinationsMemoized(this.state.selectedDate, this.state.destinations);
  }

  getTodayFormatted() {
    const today = new Date();
    const dd = today.getDate().toLocaleString('latn', {
      useGrouping: false,
      minimumIntegerDigits: 2,
    });
    const mm = (today.getMonth() + 1).toLocaleString('latn', {
      useGrouping: false,
      minimumIntegerDigits: 2,
    });
    const yyyy = today.getFullYear().toLocaleString('latn', {
      useGrouping: false,
      minimumIntegerDigits: 4,
    });
    return `${yyyy}-${mm}-${dd}`;
  }

  filterDestinationsMemoized = memoizeOne((date, dest) => 
    filterDestinations(date)
      .then(destinations => {
        this.setState({destinations});
      })
  );

  onSearchInputChange =
    (event) => {
      const selectedDate = event && event.target && event.target.value;
      if (selectedDate && this.props.onDateChanged) {
        this.props.onDateChanged(selectedDate);
        this.filterDestinationsMemoized(selectedDate, this.state.destinations);
      }
    }

  render() {
    const {classes, onSelectProperty} = this.props;
    return (
      <React.Fragment>
        <Hero imageUri='/images/beach-bungalow-hotel.jpg' titleText='Select your vacation date!' />
        <TextField
          className = {classes.dateSelect} type = 'date'
          value = {this.state.selectedDate} margin = 'normal'
          onChange={this.onSearchInputChange}
          InputLabelProps={{shrink: true}}
        />
        { (this.state.destinations && this.state.destinations.length > 0) 
            ? <Grid container spacing={24} style={{padding: 24}}>
                { this.state.destinations.map(currentDestination => (
                  <Grid item xs={12} sm={6} lg={4} xl={3} key={currentDestination.imageUri}>
                    <Destination dest={currentDestination} onSelect={() => onSelectProperty(currentDestination.id, this.state.selectedDate) } />
                  </Grid>
                ))}
              </Grid>
            : <h2>Select destination date</h2>
        }
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(DestinationList);
