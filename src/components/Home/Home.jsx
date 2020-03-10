import React from "react";
import "./Home.css";
import Slots from "../Slots/Slots";
import Registration from "../Registration/Registration";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      seller_id: null
    };
    this.setData = this.setData.bind(this);
  }

  setData(isLoggedIn, seller_id) {
    this.setState({ isLoggedIn, seller_id });
  }

  render() {
    return (
      <div>
        {this.state.isLoggedIn ? (
          <Slots seller_id={this.state.seller_id} />
        ) : (
          <Registration setData={this.setData} />
        )}
      </div>
    );
  }
}

export default Home;
