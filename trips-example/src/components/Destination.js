import React from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const Destination = ({dest, onSelect}) => {
    return(
        <div>
            { dest ? (
                <Card >
                    <CardMedia style={{height: 0, paddingTop: '56.25%'}}
                        image={dest.imageUri}
                        title={dest.title}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="headline" component="h2">
                            {dest.title}
                        </Typography>
                        <Typography component="p">
                            {dest.description}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button color="primary" onClick={onSelect}>
                            Book a vacation
                        </Button>
                    </CardActions>
                </Card>
            ) : null}
        </div>
    )
}

export default Destination;
