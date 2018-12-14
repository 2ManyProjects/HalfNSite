import React, { Component } from "react";
import StoreCard from "../storeCard/index";
import sportcheklogo from "../../logos/sportchek.png";
import "./style.scss";

class storeCardSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stores: [
        {
          id: 0,
          logo: sportcheklogo,
          colour: "#000000",
          title: "Sportschek",
          link: "https://www.sportchek.ca/",
          largestDiscount: "50",
          contrastColor: "#FFFFFF"
        },
        {
          id: 1,
          logo: sportcheklogo,
          colour: "#000000",
          title: "Sportschek",
          link: "https://www.sportchek.ca/",
          largestDiscount: "50",
          contrastColor: "#FFFFFF"
        },
        {
          id: 2,
          logo: sportcheklogo,
          colour: "#000000",
          title: "Sportschek",
          link: "https://www.sportchek.ca/",
          largestDiscount: "50",
          contrastColor: "#FFFFFF"
        },
        {
          id: 3,
          logo: sportcheklogo,
          colour: "#000000",
          title: "Sportschek",
          link: "https://www.sportchek.ca/",
          largestDiscount: "50",
          contrastColor: "#FFFFFF"
        },
        {
          id: 4,
          logo: sportcheklogo,
          colour: "#000000",
          title: "Sportschek",
          link: "https://www.sportchek.ca/",
          largestDiscount: "50",
          contrastColor: "#FFFFFF"
        },
        {
          id: 5,
          logo: sportcheklogo,
          colour: "#000000",
          title: "Sportschek",
          link: "https://www.sportchek.ca/",
          largestDiscount: "50",
          contrastColor: "#FFFFFF"
        },
        {
          id: 6,
          logo: sportcheklogo,
          colour: "#000000",
          title: "Sportschek",
          link: "https://www.sportchek.ca/",
          largestDiscount: "50",
          contrastColor: "#FFFFFF"
        },
        {
          id: 7,
          logo: sportcheklogo,
          colour: "#000000",
          title: "Sportschek",
          link: "https://www.sportchek.ca/",
          largestDiscount: "50",
          contrastColor: "#FFFFFF"
        },
        {
          id: 8,
          logo: sportcheklogo,
          colour: "#000000",
          title: "Sportschek",
          link: "https://www.sportchek.ca/",
          largestDiscount: "50",
          contrastColor: "#FFFFFF"
        },
        {
          id: 9,
          logo: sportcheklogo,
          colour: "#000000",
          title: "Sportschek",
          link: "https://www.sportchek.ca/",
          largestDiscount: "50",
          contrastColor: "#FFFFFF"
        }
      ],
      currentIndex: 1,
      translateValue: 0
    };
  }

  goToPrevSlide = () => {
    if (this.state.currentIndex === 1) return;

    this.setState(prevState => ({
      currentIndex: prevState.currentIndex - 1,
      translateValue: prevState.translateValue + this.slideWidth()
    }));
  };

  goToNextSlide = () => {
    if (this.state.currentIndex === this.state.stores.length - 1) {
      return this.setState({
        currentIndex: 1,
        translateValue: 0
      });
    }

    // This will not run if we met the if condition above
    this.setState(prevState => ({
      currentIndex: prevState.currentIndex + 1,
      translateValue: prevState.translateValue + -this.slideWidth()
    }));
  };

  slideWidth = () => {
    return 430;
  };

  render() {
    return (
      <div className="storeCardSection">
        <div
          className="slider-wrapper"
          style={{
            transform: `translateX(${this.state.translateValue}px)`,
            transition: "transform ease-out 0.45s"
          }}
        >
          {this.state.stores.map(storeCard => (
            <StoreCard
              key={storeCard.id}
              logo={storeCard.logo}
              colour={storeCard.colour}
              title={storeCard.title}
              link={storeCard.link}
              largestDiscount={storeCard.largestDiscount}
              contrastColor={storeCard.contrastColor}
              numEmployees="16"
              subtitle="stuff."
            />
          ))}
        </div>

        <LeftArrow goToPrevSlide={this.goToPrevSlide} />

        <RightArrow goToNextSlide={this.goToNextSlide} />
      </div>
    );
  }
}

const LeftArrow = props => {
  return (
    <div className="backArrow arrow" onClick={props.goToPrevSlide}>
      <i className="fa fa-arrow-left fa-2x" aria-hidden="true" />
    </div>
  );
};

const RightArrow = props => {
  return (
    <div className="nextArrow arrow" onClick={props.goToNextSlide}>
      <i className="fa fa-arrow-right fa-2x" aria-hidden="true" />
    </div>
  );
};

export default storeCardSection;
