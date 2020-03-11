import React from "react";
import axios from "axios";
import "./Slots.css";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { customStyles } from "./customStyles";

class Slots extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slots: [],
      isModalOpen: false,
      startDate: new Date()
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.setDate = this.setDate.bind(this);
    this.addAvaTime = this.addAvaTime.bind(this);
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
  }

  async componentDidMount() {
    const url = `http://localhost:8080/v1/slots/${this.props.seller_id}`;
    await axios
      .get(url)
      .then(res => {
        this.setState({
          slots: [
            {
              email: "Email",
              slot_time: "Requested Slot Time",
              status: "Status"
            },
            ...res?.data?.data
          ]
        });
      })
      .catch(err => {
        console.log("err", err);
      });
  }

  async approve(slot) {
    console.log("slot", slot);

    const url = `http://localhost:8080/v1/slots/approve/${slot._id}`;
    await axios
      .put(url, slot)
      .then(res => {
        this.setState({ slots: res.data.data });
        alert(res.data.message);
      })
      .catch(err => {
        console.log("err", err);
      });
  }

  async reject(slot) {
    const url = `http://localhost:8080/v1/slots/reject/${slot._id}`;
    await axios
      .put(url, slot)
      .then(res => {
        this.setState({ slots: res.data.data });
        alert(res.data.message);
      })
      .catch(err => {
        console.log("err", err);
      });
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

  setDate(date) {
    this.setState({
      startDate: date
    });
  }

  async addAvaTime() {
    const url = `http://localhost:8080/v1/sellers/${this.props.seller_id}/slots/add`,
      time = moment(this.state.startDate).format("ddd, MMM Do YY, hh:mm A");
    await axios
      .post(url, {
        slot_time: time,
        seller_id: this.props.seller_id
      })
      .then(res => {
        alert(res.data.message);
        this.closeModal();
      })
      .catch(err => {
        console.log("err", err);
      });
  }

  render() {
    const { slots, startDate, modalIsOpen } = this.state;
    return (
      <div>
        <div style={customStyles.welcomeText}>
          <div>Hello! {this.props.seller_name}</div>
          <div>
            <button
              style={customStyles.logout_btn}
              onClick={() => this.props.logout()}
            >
              Logout
            </button>
          </div>
        </div>
        <div>
          <button
            style={customStyles.addAva_btn}
            onClick={() => {
              this.openModal();
            }}
          >
            Add Available Time
          </button>
          <Modal style={customStyles.modal} isOpen={modalIsOpen}>
            <h3 style={{ textAlign: "center" }}>Add Available Time</h3>
            <DatePicker
              selected={startDate}
              onChange={date => this.setDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              style={{
                height: 30,
                width: "80%"
              }}
            />
            <button
              onClick={() => {
                this.addAvaTime();
              }}
              style={customStyles.add_btn}
            >
              Add
            </button>
            <div>
              <p style={customStyles.note_text}>
                Please Note : The Added Slots Will Appear on Buyer App
              </p>
            </div>
            <button
              onClick={() => {
                this.closeModal();
              }}
              style={customStyles.close_btn}
            >
              Close
            </button>
          </Modal>
        </div>
        <div style={{ width: "100vw" }}>
          {slots.length > 0 ? (
            slots.map((slot, index) => {
              return (
                <div
                  key={index}
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    justifyContent: "space-around",
                    wordWrap: "break-word"
                  }}
                >
                  <h6
                    style={{
                      alignSelf: "center",
                      width: "26%",
                      marginTop: 12.5,
                      marginBottom: 12.5
                    }}
                  >
                    {slot.email}
                  </h6>
                  <h6
                    style={{
                      alignSelf: "center",
                      width: "26%",
                      marginTop: 12.5,
                      marginBottom: 12.5
                    }}
                  >
                    {slot.slot_time}
                  </h6>
                  <h6
                    style={{
                      alignSelf: "center",
                      width: "26%",
                      marginTop: 12.5,
                      marginBottom: 12.5
                    }}
                  >
                    {slot.status}
                  </h6>
                  {slot.status === "pending" ? (
                    <>
                      {" "}
                      <button
                        style={customStyles.approve_btn}
                        onClick={() => {
                          if (slot.status === "pending") this.approve(slot);
                        }}
                      >
                        Approve
                      </button>
                      <button
                        style={customStyles.reject_btn}
                        onClick={() => {
                          if (slot.status === "pending") this.reject(slot);
                        }}
                      >
                        Reject
                      </button>{" "}
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          width: "10%",
                          maxWidth: 100
                        }}
                      />
                      <div
                        style={{
                          width: "10%",
                          maxWidth: 100
                        }}
                      />
                    </>
                  )}
                </div>
              );
            })
          ) : (
            <div>
              <p>No Pending Slots</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Slots;
