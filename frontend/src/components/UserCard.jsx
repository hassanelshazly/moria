/* eslint-disable react/prop-types */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import anon from "../assets/images/anonymous.png";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    maxHeight: 600,
    margin: "0 auto",
  },
  nameStyling: {
    textAlign: "center",
  },
  cardmediaStyling: {
    marginTop: "5%",
    marginBottom: "5%",

    borderRadius: "100%",
  },
  buttonStyling: {
    textAlign: "center",
    margin: "0 auto",
    width: "100%",
  },
});

export default function UserCard(props) {
  const { name } = props;
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.cardmediaStyling}
          component="img"
          alt="Avatar"
          image={anon}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="h2"
            className={classes.nameStyling}
          >
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions>
        <Grid container xs={6}>
          <Button
            size="small"
            color="primary"
            className={classes.buttonStyling}
          >
            View
          </Button>
        </Grid>
        <Grid container xs={6}>
          <Button
            size="small"
            color="primary"
            className={classes.buttonStyling}
          >
            Follow
          </Button>
        </Grid>
      </CardActions>
    </Card>
  );
}
