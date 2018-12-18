import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { SSL_OP_NETSCAPE_CA_DN_BUG } from "constants";
class Login extends Component {
  state = {
    openLogin: false,
    openRegister: false
  };

  handleClick = x => {
    if (x === 0) {
      this.setState({ openLogin: true, openRegister: false });
    } else {
      this.setState({ openRegister: true, openLogin: false });
    }
  };

  handleClose = x => {
    if (x === 0) this.setState({ openLogin: false, openRegister: false });
    else this.setState({ openRegister: false, openLogin: false });
  };

  render() {
    return (
      <span>
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.handleClick(0)}
        >
          Login
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.handleClick(1)}
        >
          Register
        </Button>

        <Dialog
          open={this.state.openLogin}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Login</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Something should probably go here, tag line maybe?
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Username"
              type="username"
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Password"
              type="password"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.handleClick(1)}
            >
              Register
            </Button>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.openRegister}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Register</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please consider using a spam email service such as
              <Button
                variant="contained"
                href="https://10minutemail.com"
                target="_blank"
                className="m-2"
              >
                10 Minute Mail
              </Button>
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="UserName"
              type="email"
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Password"
              type="password"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.handleClick(0)}
            >
              Login
            </Button>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Register
            </Button>
          </DialogActions>
        </Dialog>
      </span>
    );
  }
}

export default Login;
