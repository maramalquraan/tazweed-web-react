import React from "react";
import axios from "axios";
import "./Slots.css";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

class Slots extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slots: null,
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
        this.setState({ slots: res.data.data });
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
        <div>
          <button
            onClick={() => {
              this.openModal();
            }}
          >
            Add Available Time
          </button>
          <Modal isOpen={modalIsOpen} contentLabel="Example Modal">
            <h3 style={{ textAlign: "center" }}>Add Available Time</h3>
            <div>
              <DatePicker
                selected={startDate}
                onChange={date => this.setDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </div>
            <div>
              <button
                onClick={() => {
                  this.addAvaTime();
                }}
              >
                Add
              </button>
            </div>
          </Modal>
        </div>
        <div>
          {slots && slots.length ? (
            <div>
              <table>
                <tbody>
                  <th>Buyer Email</th>
                  <th>Slot Booked Time</th>
                  <th>Status</th>
                </tbody>
                {slots.map((slot, index) => {
                  return (
                    <tbody key={index}>
                      <td>{slot.email}</td>
                      <td>{slot.slot_time}</td>
                      <td>{slot.status}</td>
                      {slot.status === "pending" ? (
                        <>
                          <td>
                            <button
                              onClick={() => {
                                this.approve(slot);
                              }}
                            >
                              Approve
                            </button>
                          </td>{" "}
                          <td>
                            <button
                              onClick={() => {
                                this.reject(slot);
                              }}
                            >
                              Reject
                            </button>
                          </td>
                        </>
                      ) : null}
                    </tbody>
                  );
                })}
              </table>
            </div>
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
