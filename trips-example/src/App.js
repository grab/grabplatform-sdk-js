import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import NavBar from './components/NavBar';
import DestinationList from './components/DestinationList';
import NotFound from './components/NotFound';
import ConfirmBooking from './components/ConfirmBooking';
import AskForRide from './components/AskForRide';
import ConfirmRide from './components/ConfirmRide';

import 'typeface-roboto';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
});

class App extends Component {
  constructor() {
    super();

    this.state = {
      language: "default",
    };

    this.onLanguageChange = this.onLanguageChange.bind(this);
  }

  onLanguageChange(event) {
    const language = event.target.value;
    this.setState({
      language,
    });
  }

  render() {
    const {classes} = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.layout}>
          <header>
            <NavBar />
          </header>
          <main>
            <HashRouter>
              <Switch>
                <Route exact 
                  path='/book/:id/:date' 
                  render={({match, history}) => 
                    <ConfirmBooking
                      date={match.params.date}
                      propertyId={match.params.id}
                      onConfirm={() => history.push(`/confirmed/${encodeURIComponent(match.params.id)}/${encodeURIComponent(match.params.date)}`)}
                      onGoHome={() => history.push(`/${encodeURIComponent(match.params.date)}`)}
                    />
                  }
                />
                <Route exact 
                  path='/confirmed/:id/:date'
                  render={({match, history}) => 
                    <AskForRide
                      date={match.params.date}
                      propertyId={match.params.id}
                      finishUri={`${window.location.origin}/#/finish/${encodeURIComponent(match.params.id)}/${encodeURIComponent(match.params.date)}`}
                      onGoHome={() => history.push(`/${encodeURIComponent(match.params.date)}`)}
                      language={this.state.language}
                    />
                  }
                />
                <Route exact 
                  path='/finish/:id/:date'
                  render={({match, history}) => 
                    <ConfirmRide
                      date={match.params.date}
                      propertyId={match.params.id}
                      onGoHome={() => history.push(`/${encodeURIComponent(match.params.date)}`)}
                    />
                  }
                />
                <Route exact 
                  path='/:date?' 
                  render={({match, history}) => 
                    <DestinationList 
                      date={match.params.date} 
                      onDateChanged={(date) => history.push(`/${encodeURIComponent(date)}`)} 
                      onSelectProperty={(propertyId, date) => history.push(`/book/${encodeURIComponent(propertyId)}/${encodeURIComponent(date)}`) }
                    /> 
                  }
                />
                <Route component={NotFound} />
              </Switch>
            </HashRouter>
          </main>
          <footer>
          </footer>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(App);
