import React from "react";
import { withRouter } from "react-router";
import { withCookies, Cookies } from "react-cookie";
import { instanceOf } from "prop-types";
import axios from "axios";
import API_K from "../../keys";

const APPLICATION_ID = "C499EC1A-F6D2-77C2-FFCF-14A634B64900";
const API_KEY = API_K[0];
const serverURL =
  "https://api.backendless.com/" + APPLICATION_ID + "/" + API_KEY + "/";

export default function requireAuth(Component) {
  class AuthenticatedComponent extends React.Component {
    static propTypes = {
      cookies: instanceOf(Cookies).isRequired
    };

    componentWillMount() {
      this.checkAuth();
    }

    checkAuth() {
      const { cookies } = this.props;
      const token = cookies.get("AuthToken");
      if (token !== undefined) {
        axios
          .get(serverURL + "users/isvalidusertoken/" + token)
          .then(response => {
            // If request is good...
            console.log("Result", response);
            const isLoggedIn = response.data;
            if (!isLoggedIn) {
              const location = this.props.location;
              const redirect = location.pathname + location.search;

              this.props.router.push(`/login?redirect=${redirect}`);
            }
          })
          .catch(error => {
            console.log("error " + error);
          });
      }
    }

    render() {
      return this.props.isLoggedIn ? <Component {...this.props} /> : null;
    }
  }

  return withRouter(withCookies(AuthenticatedComponent));
}
