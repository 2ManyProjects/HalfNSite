// MyStoreCheckout.js
import React from "react";
import { CardElement, Elements, injectStripe } from "react-stripe-elements";
import Backendless from "backendless";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const handleBlur = () => {
  //   console.log("[blur]");
};
const handleChange = change => {
  //   console.log("[change]", change);
};
const handleClick = () => {
  //   console.log("[click]");
};
const handleFocus = () => {
  //   console.log("[focus]");
};
const handleReady = () => {
  //   console.log("[ready]");
};

const createOptions = fontSize => {
  return {
    style: {
      base: {
        fontSize: "16px",
        color: "#495057",
        fontFamily:
          '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
        "::placeholder": {
          color: "#868e96"
        }
      },
      invalid: {
        color: "#9e2146"
      }
    }
  };
};

class _CardForm extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = { money: this.props.money, completed: false };
  }

  async submit(ev) {
    const self = this;
    ev.preventDefault();
    let { token } = await this.props.stripe.createToken({ name: "Name" });
    console.log("TOKEN", token);
    let chargeData = {
      token: token.id,
      amount: this.state.money * 100
    };

    Backendless.CustomServices.invoke("Stripe", "charge", chargeData)
      .then(function(result) {
        let channel = Backendless.Messaging.subscribe("stripe");
        let selector = "id = '" + result.id + "'";
        function onMessage(stringMessage) {
          self.setState({ completed: true });
          console.log("Message received: " + stringMessage);
        }

        channel.addMessageListener(selector, onMessage);
      })
      .catch(function(error) {
        console.log("Error", error);
      });
  }
  render() {
    if (this.state.completed) {
      return (
        <Typography variant="h4" color="inherit" noWrap>
          Purchase Complete
        </Typography>
      );
    }
    return (
      <div>
        <label>Credit Card details</label>
        <div style={{ width: window.innerWidth * 0.45 }}>
          <CardElement
            className="form-control"
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onReady={handleReady}
            {...createOptions(this.props.fontSize)}
          />
        </div>
        <Button onClick={this.submit} color="primary">
          Checkout
        </Button>
      </div>
    );
  }
}
const CardForm = injectStripe(_CardForm);

class Checkout extends React.Component {
  constructor() {
    super();
    this.state = {
      elementFontSize: window.innerWidth < 450 ? "14px" : "18px"
    };
    window.addEventListener("resize", () => {
      if (window.innerWidth < 450 && this.state.elementFontSize !== "14px") {
        this.setState({ elementFontSize: "14px" });
      } else if (
        window.innerWidth >= 450 &&
        this.state.elementFontSize !== "18px"
      ) {
        this.setState({ elementFontSize: "18px" });
      }
    });
  }

  render() {
    const { elementFontSize } = this.state;
    return (
      <center className="Checkout">
        <Elements>
          <CardForm money={this.props.money} fontSize={elementFontSize} />
        </Elements>
      </center>
    );
  }
}
export default Checkout;
