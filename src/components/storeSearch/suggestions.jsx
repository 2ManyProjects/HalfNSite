import React from "react";

const Suggestions = props => {
  if (props.results !== undefined) {
    const options = props.results.map(r => <li key={r.StoreID}>{r.Name}</li>);
    const filtered = options.filter(function(elem, pos, arr) {
      return arr.indexOf(elem) === pos;
    });
    return <div>{filtered}</div>;
  } else {
    return <center>No Stores Found</center>;
  }
};

export default Suggestions;
