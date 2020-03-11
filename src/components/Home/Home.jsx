import React from "react";
import "./Home.css";
import Slots from "../Slots/Slots";
import Registration from "../Registration/Registration";
import axios from "axios";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      seller_id: null,
      seller_name: null
    };
    this.setData = this.setData.bind(this);
    this.logout = this.logout.bind(this);
  }

  async componentDidMount() {
    const seller_id = this.props.seller_id
        ? this.props.seller_id
        : localStorage.getItem("sellerId") || null,
      url = `http://localhost:8080/v1/sellers/${seller_id}`;
    await axios
      .get(url)
      .then(res => {
        this.setState({
          seller_name: res.data.seller.name,
          isLoggedIn: true,
          seller_id: seller_id
        });
      })
      .catch(err => {
        console.log("err", err);
      });
  }

  setData(isLoggedIn, seller_id, seller_name) {
    this.setState({ isLoggedIn, seller_id, seller_name });
  }

  logout() {
    localStorage.setItem("token", "");
    localStorage.setItem("sellerId", "");
    this.setState({
      seller_name: null,
      isLoggedIn: false,
      seller_id: null
    });
  }

  render() {
    return (
      <div>
        {this.state.isLoggedIn ? (
          <Slots
            seller_id={this.state.seller_id}
            seller_name={this.state.seller_name}
            logout={this.logout}
          />
        ) : (
          <Registration setData={this.setData} />
        )}
      </div>
    );
  }
}

export default Home;
