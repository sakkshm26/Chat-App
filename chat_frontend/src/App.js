import React, { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';

import { withStyles } from "@material-ui/core/styles";

const useStyles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  root: {
    boxShadow: 'none',
  }
});


function App(props) {

  const classes = props.classes

  const [state, setState] = useState({
    isLoggedIn: false,
    messages: [],
    value: '',
    name: '',
    room: 'Brainstorm'
  })

  let client = new W3CWebSocket('ws://127.0.0.1:8000/ws/chat/' + state.room + '/');

  const onButtonClicked = (e) => {
    e.preventDefault();
    client.send(JSON.stringify({
      type: "message",
      message: state.value,
      username: state.name
    }));
    setState(prevState => ({ ...prevState, value: '' }))
  }

  useEffect(() => {
    client.onopen = () => {
      console.log("Client CONNECTED!")
    }

    client.onmessage = message => {
      const dataFromServer = JSON.parse(message.data)
      // console.log(dataFromServer)

      if (dataFromServer) {
        setState(prevState => ({
          ...prevState,
          messages: [
            ...prevState.messages,
            {
              msg: dataFromServer.message,
              name: dataFromServer.username
            }
          ]
        }))
      }
    }
  }, [])

  return (
    <Container component="main" maxWidth="xs">
      {state.isLoggedIn ?
        <div style={{ marginTop: 50, }}>
          Room Name: {state.room}
          <Paper style={{ height: 500, maxHeight: 500, overflow: 'auto', boxShadow: 'none', }}>
            {state.messages.map(message => <>
              <Card className={classes.root}>
                <CardHeader
                  avatar={
                    <Avatar className={classes.avatar}>
                      {message.name.slice(0,1).toUpperCase()}
                    </Avatar>
                  }
                  title={message.name}
                  subheader={message.msg}
                />
              </Card>
            </>)}
          </Paper>

          <form className={classes.form} noValidate onSubmit={(e) => onButtonClicked(e)}>
            <TextField
              id="outlined-helperText"
              label="Make a comment"
              variant="outlined"
              value={state.value}
              fullWidth
              onChange={e => {
                setState(prevState => ({ ...prevState, value: e.target.value }));
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Start Chatting
            </Button>
          </form>
        </div>
        :
        <div>
          <CssBaseline />
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              ChattyRooms
            </Typography>
            <form className={classes.form} noValidate onSubmit={() => setState(prevState => ({ ...prevState, isLoggedIn: true }))}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Chatroom Name"
                name="Chatroom Name"
                autoFocus
                value={state.room}
                onChange={e => {
                  setState(prevState => ({
                    ...prevState,
                    room: e.target.value
                  }));
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="Username"
                label="Username"
                type="Username"
                id="Username"
                value={state.name}
                onChange={e => {
                  setState(prevState => ({
                    ...prevState,
                    name: e.target.value
                  }));
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Start Chatting
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </div>}
    </Container>
  );
}

export default withStyles(useStyles)(App);
