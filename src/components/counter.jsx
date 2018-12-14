import React, { Component } from "react";

class Counter extends Component {
  componentDidUpdate(prevProps, prevState) {
    // console.log("prevProps", prevProps);
    // console.log("prevState", prevState);

    if (prevProps.counter.value !== this.props.counter.value) {
      //conditional Ajax calls
    }
  }

  componentWillUnmount() {
    // cleanup Listeners
    // console.log("Counter - Unmount");
  }

  componentWillMount() {
    // console.log("Counter - mount");
  }

  render() {
    return (
      <div>
        <span className={this.getBadgeClasses()}> {this.formatCount()}</span>
        <button
          onClick={() => this.props.onIncrement(this.props.counter)}
          className="btn btn-secondary btn-sm m-2"
        >
          +
        </button>
        <button
          onClick={() => this.props.onDecrement(this.props.counter)}
          className="btn btn-secondary btn-sm"
        >
          -
        </button>
        <button
          onClick={() => this.props.onDelete(this.props.counter.id)}
          className="btn btn-danger btn-sm m-2"
        >
          Delete
        </button>
      </div>
    );
  }

  getBadgeClasses() {
    let classes = "badge m-2 badge-";
    classes += this.getState();
    return classes;
  }

  getState() {
    const { value } = this.props.counter;
    if (value === 0) {
      return "warning";
    } else {
      return "primary";
    }
  }

  formatCount() {
    const { value } = this.props.counter;
    return value === 0 ? "Zero" : value;
  }
}

export default Counter;

// state = {
//   vote: -1,
//   question: "A Friend in every Store vs Friends with Employee Benefits",
//   tagline: "",
//   tags: ["tag1", "tag2", "tag3"],
//   hide: false
// };

// getHidden = () => {
//   return this.state.hide;
// };

// handleVote = x => {
//   this.setState({ vote: x });
//   this.setState({ hide: true });
//   if (x === 0) {
//     this.setState({
//       tagline: "A Friend in Every Store"
//     });
//   } else {
//     this.setState({
//       tagline: "Friends with Employee Benefits"
//     });
//   }
//   //sendVote(x)
// };

// renderTags() {
//   if (this.state.tags.length === 0) return <p> There are no Tags!</p>;
//   return (
//     <ul>
//       {this.state.tags.map(tags => (
//         <li key={tags}> {tags} </li>
//       ))}
//     </ul>
//   );
// }

// <button
//           hidden={this.getHidden()}
//           onClick={e => this.handleVote(0)}
//           className="btn btn-secondary btn-sm"
//         >
//           Vote 1
//         </button>
//         <button
//           hidden={this.getHidden()}
//           onClick={e => this.handleVote(1)}
//           className="btn btn-secondary btn-sm"
//         >
//           Vote 2
//         </button>
//         <span> {this.renderTagline()}</span>
//         {this.state.tags.length === 0 && "Please create a new tag!"}
//         {this.renderTags()}

//   renderTagline = () => {
//     const { vote } = this.state;
//     if (vote === -1) {
//       return <h1>{this.state.question}</h1>;
//     } else {
//       return <h1>{this.state.tagline}</h1>;
//     }
//   };
