import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import ReactTable from "react-table";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FormErrors } from "./../dialog/FormErrors";
import Checkbox from "@material-ui/core/Checkbox";
import { FormControlLabel } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import Slider from "@material-ui/lab/Slider";
import Grid from "@material-ui/core/Grid";
import { DateFormatInput } from "material-ui-next-pickers";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const styles = theme => ({
  card: {
    minWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  root: {
    width: 300
  },
  slider: {
    padding: "22px 0px"
  },
  grid: {
    width: "60%"
  },
  button: {
    display: "block",
    marginTop: theme.spacing.unit * 2
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  }
});

class SimpleCard extends Component {
  state = {
    open: false,
    disabled: true,
    term: "",
    openPeriod: false,
    Errors: {
      date: "",
      amount: "",
      rate: ""
    },
    atCost: false,
    currentAmnt: 0,
    totalAmnt: 0,
    period: 30,
    currentDate: {
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      minute: 1,
      second: 1,
      hour: 1
    },
    limit: true,
    rate: 25,
    reoccuring: true,
    resetDate: {
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      minute: 1,
      second: 1,
      hour: 1,
      tempDate: ""
    },
    selected: 0,
    selectedAmnt: 0,
    text: "No Limitations",
    anchorEl: null,
    mobileMoreAnchorEl: null
  };

  resetStateValues = () => {
    this.setState({
      open: this.state.open,
      disabled: true,
      term: "",
      openPeriod: false,
      Errors: {
        date: "",
        amount: "",
        rate: ""
      },
      atCost: false,
      currentAmnt: 0,
      totalAmnt: 0,
      period: 30,
      currentDate: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        minute: 1,
        second: 1,
        hour: 1
      },
      limit: true,
      rate: 25,
      reoccuring: true,
      resetDate: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        minute: 1,
        second: 1,
        hour: 1,
        tempDate: ""
      },
      selected: 0,
      selectedAmnt: 0,
      text: "No Limitations",
      anchorEl: null,
      mobileMoreAnchorEl: null
    });
  };

  isBefore = (dateX, dateY) => {
    if (dateX.year < dateY.year) return true;
    else if (dateX.year > dateY.year) return false;
    else {
      if (dateX.month < dateY.month) return true;
      else if (dateX.month > dateY.month) return false;
      else {
        if (dateX.day < dateY.day) return true;
        else if (dateX.day > dateY.day) return false;
        else {
          return true;
        }
      }
    }
  };

  generateGuid = () => {
    var result, i, j;
    result = "";
    for (j = 0; j < 32; j++) {
      if (j === 8 || j === 12 || j === 16 || j === 20) result = result + "-";
      i = Math.floor(Math.random() * 16)
        .toString(16)
        .toUpperCase();
      result = result + i;
    }
    return result;
  };

  handleOpen = () => {
    this.resetStateValues();
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpenP = () => {
    this.setState({ openPeriod: true });
  };

  handleCloseP = () => {
    this.setState({ openPeriod: false });
  };

  getDealType = bool => {
    if (bool === false) return "Normal";
    return "Factory +  Discount";
  };

  handleDelete = (store, deal) => {
    this.props.onDealDelete(store, deal);
  };

  handleEdit = (store, deal) => {
    let newDeal = deal;
    const data = parseInt(deal.totalAmnt) + 1;
    newDeal.totalAmnt = data.toString();
    this.props.onDealEdit(store, deal, newDeal);
  };

  valChange = e => {
    let id = e.target.id;
    if (e.target.name === "period") {
      id = e.target.name;
      this.setState({ term: this.getPeriod(e.target.value) }, () => {
        this.validateField(id);
      });
    }
    let value;
    if (id === "atCost") {
      value = e.target.checked;
    } else if (id === "currentAmnt" || id === "totalAmnt") {
      value = e.target.value;
      if (value > 10) {
        value = 10;
      }
    } else {
      value = e.target.value;
    }
    this.setState({ [id]: value }, () => {
      this.validateField(id);
    });
  };

  handleChange = (event, value) => {
    this.setState({ rate: value }, () => {
      this.validateField("rate");
    });
  };

  handleDateChange = date => {
    const dateArray = date.toString().split(" ");
    let mon = 0;
    switch (dateArray[1]) {
      case "Jan":
        mon = 1;
        break;
      case "Feb":
        mon = 2;
        break;
      case "Mar":
        mon = 3;
        break;
      case "Apr":
        mon = 4;
        break;
      case "May":
        mon = 5;
        break;
      case "Jun":
        mon = 6;
        break;
      case "Jul":
        mon = 7;
        break;
      case "Aug":
        mon = 8;
        break;
      case "Sep":
        mon = 9;
        break;
      case "Oct":
        mon = 10;
        break;
      case "Nov":
        mon = 11;
        break;
      case "Dec":
        mon = 12;
        break;
      default:
        break;
    }
    this.setState(
      {
        resetDate: {
          day: parseInt(dateArray[2]),
          month: mon,
          year: parseInt(dateArray[3]),
          minute: 1,
          second: 1,
          hour: 1,
          tempDate: date
        }
      },
      () => {
        this.validateField("resetDate");
      }
    );
  };

  validateField(fieldName) {
    let fieldErrors = this.state.Errors;

    switch (fieldName) {
      case "currentAmnt":
        if (this.state.currentAmnt > this.state.totalAmnt) {
          fieldErrors.amount =
            " The Current Amount cannot be greater than the Total Amount";
        } else {
          fieldErrors.amount = "";
        }
        break;
      case "totalAmnt":
        if (this.state.currentAmnt > this.state.totalAmnt) {
          fieldErrors.amount =
            " The Current Amount cannot be greater than the Total Amount";
        } else if (this.state.totalAmnt === 0) {
          fieldErrors.amount = " The Total Amount cannot be 0";
        } else {
          fieldErrors.amount = "";
        }
        break;
      case "rate":
        if (this.state.rate < 10) {
          fieldErrors.rate = " less than 10% may not be worth your time";
        } else {
          fieldErrors.rate = "";
        }
        break;
      case "resetDate":
        if (this.isBefore(this.state.resetDate, this.state.currentDate)) {
          fieldErrors.date = " Please select a Reset date In the future";
        } else if (this.state.resetDate.tempDate.length < 2) {
          fieldErrors.date = " Please select a Reset date";
        } else {
          fieldErrors.date = "";
        }
        break;
      default:
        break;
    }
    this.setState(
      {
        Errors: fieldErrors
      },
      () => {
        this.validateErrors();
      }
    );
  }
  validateErrors = () => {
    const val =
      this.state.Errors.date.length > 1 || this.state.Errors.amount.length > 1;
    this.setState({ disabled: val });
  };

  handleClick = () => {
    let errors = this.state.Errors;
    let disable = this.state.disabled;
    if (this.state.resetDate.tempDate.length < 1) {
      disable = true;
      errors.date = " Please select a Reset date";
    }
    if (this.isBefore(this.state.resetDate, this.state.currentDate)) {
      disable = true;
      errors.date = " Please select a Reset date In the future";
    }

    if (this.state.currentAmnt > this.state.totalAmnt) {
      disable = true;
      errors.amount =
        " The Current Amount cannot be greater than the Total Amount";
    } else if (this.state.totalAmnt === 0) {
      disable = true;
      errors.amount = " The Total Amount cannot be 0";
    }
    const randID = this.generateGuid();

    this.setState({ Errors: errors, disabled: disable, id: randID }, () => {
      if (disable === false) {
        const {
          atCost,
          currentAmnt,
          totalAmnt,
          period,
          rate,
          resetDate,
          currentDate,
          text,
          reoccuring,
          limit,
          selected,
          selectedAmnt,
          id
        } = this.state;
        const dealData = {
          atCost,
          currentAmnt,
          totalAmnt,
          rate,
          text,
          reoccuring,
          limit,
          period,
          selected,
          selectedAmnt,
          currentDate,
          id,
          resetDate: {
            day: resetDate.day,
            month: resetDate.month,
            year: resetDate.year,
            minute: resetDate.minute,
            hour: resetDate.hour,
            second: resetDate.second
          }
        };
        this.props.onDealCreate(this.props.storecard, dealData);
        this.handleClose();
      }
    });
  };

  getPeriod = val => {
    switch (val) {
      case 7:
        return "Weekly";
      case 14:
        return "BiWeekly";
      case 30:
        return "Monthly";
      case 60:
        return "BiMonthly";
      case 90:
        return "Quarterly";
      case 180:
        return "Semi-Yearly";
      case 360:
        return "Yearly";
      case 720:
        return "BiYearly";
      case 1080:
        return "TriYearly";
      default:
        return "Monthly";
        break;
    }
  };

  stringDivider = (str, width, spaceReplacer) => {
    if (str.length > width) {
      var p = width;
      for (; p > 0 && str[p] != " "; p--) {}
      if (p > 0) {
        var left = str.substring(0, p);
        var right = str.substring(p + 1);
        return (
          left + spaceReplacer + this.stringDivider(right, width, spaceReplacer)
        );
      }
    }
    return str;
  };

  render() {
    const { classes } = this.props;
    const { rate, resetDate, term } = this.state;

    const columns = [
      {
        Header: "Edit",
        id: "button",
        accessor: d => d,
        maxWidth: 180,
        Cell: props => (
          <span>
            <button
              onClick={() =>
                this.handleEdit(this.props.storecard, props.original)
              }
              className="btn btn-secondary btn-sm m-2 btnhvr"
            >
              Edit
            </button>
            <button
              onClick={() =>
                this.handleDelete(this.props.storecard, props.original)
              }
              className="btn btn-secondary btn-sm m-2 btnhvr"
            >
              Delete
            </button>
          </span>
        ) // Custom cell components!
      },
      {
        Header: "Type",
        id: "atcost",
        maxWidth: 150,
        accessor: d => this.getDealType(d.atCost)
      },
      {
        Header: "Rate",
        id: "rate",
        maxWidth: 70,
        accessor: d => d.rate,
        Cell: props => <span className="number">{props.value}%</span> // Custom cell components!
      },
      {
        Header: "Amount",
        id: "totalAmnt",
        maxWidth: 70,
        accessor: d => d,
        Cell: props => (
          <span>
            {props.value.currentAmnt} / {props.value.totalAmnt}
          </span>
        ) // Custom cell components!
      },
      {
        Header: "Restrictions",
        id: "text",
        accessor: d => d.text,
        Cell: props => (
          <span className="text">{props.value}</span>
          //<span>{this.stringDivider(props.value, 40, "<br/>\n")}</span>
        ) // Custom cell components!
      }
    ];

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            {this.props.storecard.ID}
          </Typography>
          <Typography variant="h5" component="h2">
            {this.props.storecard.name}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            {this.props.storecard.address}
          </Typography>
          <br />
          <center>
            <ReactTable
              data={this.props.storecard.storeDeals}
              columns={columns}
              defaultPageSize={this.props.storecard.storeDeals.length}
              className="-striped -highlight"
              resizable={false}
              noDataText={false}
              showPageSizeOptions={false}
              showPageJump={false}
              showPagination={false}
            />
          </center>

          <Button onClick={this.handleOpen} variant="contained" color="primary">
            Add Deal
          </Button>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Add New Deal</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please keep a reasonable limit or we may have to limit your
                account
              </DialogContentText>
              <div className="panel panel-default warning">
                <FormErrors formErrors={this.state.Errors} />
              </div>
              <TextField
                autoFocus
                margin="dense"
                id="text"
                label="Any Constraints?"
                type="text"
                onChange={this.valChange}
                required={true}
                inputProps={{ maxLength: 100 }}
                fullWidth
              />
              <Typography id="label">{this.state.text.length}/100</Typography>
              <center>
                <Typography id="label">Amount of Discounts</Typography>
              </center>
              <center>
                <Input
                  type="number"
                  onChange={this.valChange}
                  required={true}
                  inputProps={{ min: "0", max: "10", step: "1" }}
                  id="currentAmnt"
                  placeholder="Current"
                />
                &emsp;
                <Input
                  type="number"
                  onChange={this.valChange}
                  required={true}
                  inputProps={{ min: "0", max: "10", step: "1" }}
                  id="totalAmnt"
                  placeholder="Total"
                />
              </center>
              <br />
              <center>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.checkedB}
                      onChange={this.valChange}
                      id="atCost"
                      value="checkedB"
                      color="primary"
                    />
                  }
                  label="At Factory Cost?"
                />

                <Grid container className={classes.grid} justify="space-around">
                  <div className={classes.root}>
                    <Typography id="label">Discount Rate</Typography>
                    <Slider
                      classes={{ container: classes.slider }}
                      value={rate}
                      required={true}
                      min={5}
                      max={100}
                      step={5}
                      id="rate"
                      onChange={this.handleChange}
                    />
                    <Typography id="label">{this.state.rate}%</Typography>
                  </div>
                </Grid>
                <Grid container className={classes.grid} justify="space-around">
                  <DateFormatInput
                    id="resetDate"
                    required={true}
                    margin="normal"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center"
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center"
                    }}
                    label="Next Reset Date"
                    value={resetDate.tempDate}
                    onChange={this.handleDateChange}
                  />
                </Grid>
                <form autoComplete="off">
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="period">
                      <Typography id="label">Select Renewal Period</Typography>
                    </InputLabel>
                    <br />
                    <Select
                      open={this.state.openPeriod}
                      onClose={this.handleCloseP}
                      onOpen={this.handleOpenP}
                      required={true}
                      value={term}
                      onChange={this.valChange}
                      inputProps={{
                        name: "period",
                        id: "period"
                      }}
                    >
                      <MenuItem value={7}>Weekly</MenuItem>
                      <MenuItem value={14}>BiWeekly</MenuItem>
                      <MenuItem value={30}>Monthly</MenuItem>
                      <MenuItem value={60}>BiMonthly</MenuItem>
                      <MenuItem value={90}>Quarterly</MenuItem>
                      <MenuItem value={180}>Semi-Yearly</MenuItem>
                      <MenuItem value={360}>Yearly</MenuItem>
                      <MenuItem value={720}>BiYearly</MenuItem>
                      <MenuItem value={1080}>TriYearly</MenuItem>
                    </Select>
                  </FormControl>
                </form>
              </center>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleClick}
                color="primary"
                variant="outlined"
                disabled={this.state.disabled}
              >
                Submit
              </Button>
              <Button onClick={this.handleClose} color="secondary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
          <br />
          <Button
            onClick={() => this.props.onDelete(this.props.storecard.ID)}
            variant="contained"
            color="secondary"
          >
            Delete Store
          </Button>
        </CardContent>
      </Card>
    );
  }
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleCard);
