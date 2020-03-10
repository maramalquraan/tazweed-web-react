import React from "react";
import "./Registration.css";
import Modal from "react-modal";
import axios from "axios";

const customStyles = {
  modal: {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      width: "40%",
      maxWidth: 250
    }
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    alignSelf: "center",
    width: "100%"
  },
  txt: {
    textAlign: "center",
    fontSize: 12.5
  },
  anchor: {
    cursor: "pointer",
    color: "blue"
  }
};

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: true,
      registration: "Login",
      registration_option: "Signup",
      registration_option_txt: "Don't have an account? ",
      name: "",
      email: "",
      password: ""
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.change_registration = this.change_registration.bind(this);
  }

  componentWillMount() {
    Modal.setAppElement("body");
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  change_registration() {
    this.setState(
      {
        registration: this.state.registration === "Signup" ? "Login" : "Signup",
        registration_option:
          this.state.registration_option === "Signup" ? "Login" : "Signup",
        registration_option_txt:
          this.state.registration === "Login"
            ? "Already have an account? "
            : "Don't have an account? "
      },
      () => {
        this.setState({
          password: "",
          name: "",
          email: ""
        });
      }
    );
  }

  setKeyValue(key, value) {
    this.setState({
      [key]: value
    });
  }

  async submit() {
    const { name, email, password, registration } = this.state,
      url = `http://localhost:8080/v1/sellers/${registration.toLowerCase()}`;
    await axios
      .post(url, { name, email, password })
      .then(res => {
        alert(res.data.message);
        this.closeModal();
        this.props.setData(true, res.data.seller._id);
      })
      .catch(err => {
        // alert(err.response.data.message);
        console.log("err", err);
        this.props.setData(false, null);
      });
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.state.modalIsOpen}
          style={customStyles.modal}
          contentLabel="Example Modal"
        >
          <h3 style={{ textAlign: "center" }}>{this.state.registration}</h3>
          <div className="container">
            {this.state.registration === "Signup" ? (
              <input
                type="text"
                style={customStyles.input}
                placeholder="Name"
                onChange={e => {
                  this.setKeyValue("name", e.target.value);
                }}
              />
            ) : null}
            <input
              type="email"
              style={customStyles.input}
              placeholder="Email"
              onChange={e => {
                this.setKeyValue("email", e.target.value);
              }}
            />
            <input
              type="password"
              style={customStyles.input}
              placeholder="Password"
              onChange={e => {
                this.setKeyValue("password", e.target.value);
              }}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <input
              id="submit"
              type="submit"
              name="Submit"
              value="Submit"
              className="btn btn-primary btn-lg"
              onClick={() => this.submit()}
            />
          </div>
          <p style={customStyles.txt}>
            {this.state.registration_option_txt}{" "}
            <span
              style={customStyles.anchor}
              onClick={this.change_registration}
            >
              {this.state.registration_option}
            </span>
          </p>
        </Modal>
      </div>
    );
  }
}

export default Registration;
