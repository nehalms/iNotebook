import { useEffect, useState, useContext, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import CryptoJS from 'crypto-js';
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Container,
  Card,
  Button,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import AuthContext from '../../context/auth_state/authContext';
import { useSecretKey } from "../Requests/getSecretKey";
import { history } from "../History";
const localizer = momentLocalizer(moment);

const WorkCalendar = (props) => {
  const [events, setEvents] = useState([]);
  const { getSecretKey } = useSecretKey();
  const { userState, handleSessionExpiry } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    desc: "",
  });

  useEffect(() => {
    if (!userState.loggedIn) {
      history.navigate("/");
      return;
    } else {
      fetchevents();
    }
  }, [userState]);

  const fetchevents = async () => {
    try {
      let secretKey = await getSecretKey();
      props.setLoader({ showLoader: true, msg: "Making up the calendar..." });
      let response = await fetch(`${process.env.REACT_APP_BASE_URL}/calevents`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      });
      let json = await response.json();
      if (json.status == 1) {
        let decryptedEvents = [];
        json.data.map((event) => {
          event = {
            ...event,
            title: CryptoJS.AES.decrypt(event.title, secretKey).toString(CryptoJS.enc.Utf8),
            desc: CryptoJS.AES.decrypt(event.desc, secretKey).toString(CryptoJS.enc.Utf8),
            start: new Date(CryptoJS.AES.decrypt(event.start, secretKey).toString(CryptoJS.enc.Utf8)),
            end: new Date(CryptoJS.AES.decrypt(event.end, secretKey).toString(CryptoJS.enc.Utf8)),
          }
          decryptedEvents.push(event);
        });
        setEvents(decryptedEvents);
      }
    } catch (err) {
      console.log('Error***', err);
      props.showAlert("Internal server Error", 'danger', 10102);
    } finally {
      props.setLoader({ showLoader: false });
    }
  }

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      props.showAlert('Please enter all the required fields', 'info', 23648);
      return;
    }

    if(!(newEvent.start < newEvent.end)) {
      props.showAlert('End date should be greater than Start date', 'danger', 23648);
      return;
    }

    try {
      let secretKey = await getSecretKey();
      props.setLoader({ showLoader: true, msg: "Making up the calendar..." });
      let response = await fetch(`${process.env.REACT_APP_BASE_URL}/calevents/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          title: CryptoJS.AES.encrypt(newEvent.title, secretKey).toString(),
          desc: CryptoJS.AES.encrypt(newEvent.desc, secretKey).toString(),
          start: CryptoJS.AES.encrypt(newEvent.start, secretKey).toString(),
          end: CryptoJS.AES.encrypt(newEvent.end, secretKey).toString(),
        })
      });
      let json = await response.json();
      if(json.error) {
        handleSessionExpiry(json);
        props.showAlert(json.error, 'info', 38742);
        return;
      }
      if(json.status == 1) {
        setNewEvent({ title: "", start: "", end: "", desc: "" });
        setShowModal(false);
        fetchevents();
        props.showAlert(json.msg, 'success', 98342);
      }
    } catch (err) {
      console.log('Error***', err);
      props.showAlert("Internal server Error", 'danger', 10102);
    } finally {
      props.setLoader({ showLoader: false });
    }
  };

  const handleDeleteEvent = async (event) => {
    try {
      props.setLoader({ showLoader: true, msg: "Deleting the event..." });
      let response = await fetch(`${process.env.REACT_APP_BASE_URL}/calevents/${event._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      });
      let json = await response.json();
      if(json.error) {
        handleSessionExpiry(json);
        props.showAlert(json.error, 'info', 38742);
        return;
      }
      if(json.status === 1) {
        setSelectedEvent(null);
        fetchevents();
        props.showAlert(json.msg, 'success', 98342);
      }
    } catch (err) {
      console.log('Error***', err);
      props.showAlert("Internal server Error", 'danger', 10102);
    } finally {
      props.setLoader({ showLoader: false });
    }
  }

  const handleChange = (e) => {
    setNewEvent({...newEvent , [e.target.name]: e.target.value})
  }

  const rowData = {
    padding: '4px',
    textAlign: 'left'
  }

  return (
    <Container fluid="lg" className="py-2 pb-5">
      <h2 className="text-center mb-4">
        <i className="mx-2 fa-solid fa-calendar-days"></i>Work Calendar
      </h2>

      <Button
        className="btn btn-warning"
        style={{position: 'fixed', zIndex: '1', right: '25px', bottom: '25px'}}
        onClick={() => setShowModal(true)}
      >
        <i className="me-2 fa-solid fa-plus"></i> Add Event
      </Button>

      <Card className="shadow-lg border-0">
        <Card.Body className="p-2 p-md-3">
          <div style={{ height: "70vh", minHeight: "400px" }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              defaultView="month"
              views={["month", "week", "day", "agenda"]}
              components={{
                event: ({ event }) => (
                  <div>
                    <strong>{event.title}</strong>
                  </div>
                ),
              }}
              onSelectEvent={(event) => setSelectedEvent(event)}
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: `${event.end < new Date() ? "#6b93cf" : "#3686ff"}`,
                  borderRadius: "0.25rem",
                  color: "white",
                  fontSize: "0.9rem",
                  padding: "2px 2px",
                },
              })}
              className="bg-light rounded"
              popup
            />
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Add New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Event Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter event title"
                value={newEvent.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Start Time *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="start"
                    value={newEvent.start}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>End Time *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="end"
                    value={newEvent.end}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="desc"
                placeholder="Optional event details"
                value={newEvent.desc}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddEvent}>
            Save Event
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={!!selectedEvent} onHide={() => setSelectedEvent(null)} centered>
        <Modal.Header closeButton>
            <Modal.Title className="text-center">{selectedEvent?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <table>
                <tbody>
                    <tr>
                        <td style={rowData}><strong>Description:</strong></td>
                        <td style={rowData}>{selectedEvent?.desc.length ? selectedEvent.desc : 'No description'}</td>
                    </tr>
                    <tr>
                        <td style={rowData}><strong>Start Date:</strong></td>
                        <td style={rowData}>{moment(new Date(selectedEvent?.start)).format('LLL')}</td>
                    </tr>
                    <tr>
                        <td style={rowData}><strong>End Date:</strong></td>
                        <td style={rowData}>{moment(new Date(selectedEvent?.end)).format('LLL')}</td>
                    </tr>
                    <tr>
                        <td style={rowData}><strong>Created Date:</strong></td>
                        <td style={rowData}>{moment(new Date(selectedEvent?.createdAt)).format('LLL')}</td>
                    </tr>
                </tbody>
            </table>
        </Modal.Body>
        <Modal.Footer>
            <Button className="btn btn-secondary" onClick={() => setSelectedEvent(null)}>Close</Button>
            <Button className="btn btn-danger" onClick={() => handleDeleteEvent(selectedEvent)}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default WorkCalendar;
