import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import Workdays from '../../api/workdays/workdays';
import TimePicker from 'react-bootstrap-time-picker';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { OverlayTrigger, Popover, Button, Modal, FormControl } from 'react-bootstrap';

BigCalendar.momentLocalizer(moment);

const DragAndDropCalendar = withDragAndDrop(BigCalendar);

const styles = {
    calendarView: {
        minHeight: '580px',
        flex: 1
    }
}

let tmpEvents = [];
let minDate = new Date(2017, 9, 24, 7, 0, 0);
let maxDate = new Date(2017, 9, 24, 22, 0, 0);
const subscription = Meteor.subscribe('workdays.list');

class WeekHeader extends React.Component {
    render() {
        let eventDate = this.props.date;

        const dateString = moment(eventDate).format('MMM D, YYYY');
        const day = moment(eventDate).format('dddd');

        let letterDay = ' ';
        const letterDateString = moment(eventDate).format('YYYY-MM-DD');

        if (subscription.ready()) {
          const workdays = Workdays.find({dates : letterDateString}).fetch();
          if (workdays.length > 0) {
              letterDay = workdays[0].alphabet;
          }         
        }

        return  <span>
                    <em style={{ marginTop: 10 }}>{day}</em>
                    <br/>
                    <p>{ dateString }</p>
                    <em style={{ color: 'magenta'}}>{letterDay}</em>
                </span>
    }
}

const popoverHoverFocus = (title, startDate, endDate) => (
    <Popover id="popover-trigger-hover-focus">
      Event : <strong>{title}</strong>
      <br />
      { moment(startDate).format('ddd MMM DD YYYY') }
      <br />
      Start : { moment(startDate).format('h:mm:ss A') }
      <br />
      End : { moment(endDate).format('h:mm:ss A') }
    </Popover>
  );

class MyEvent extends React.Component {
    render() {

        const { event } = this.props;
        return <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={popoverHoverFocus(event.title, event.start, event.end)}>
                    <span style={ {display: 'block', width: '100%', height: '100%', paddingTop: '10px'} }>
                        <em style={{ color: 'white', fontWeight: 'normal', fontSize: '13pt'}}>{event.title}</em>
                    </span>
               </OverlayTrigger>;
    }

}


class GDCalendar extends React.Component {
    constructor (props) {
        super(props);

        tmpEvents = this.props.doc && this.props.doc.events ? this.props.doc.events : [];
        this.state = {
            events: tmpEvents,
            showEventModal: false,
        }

        this.moveEvent = this.moveEvent.bind(this);
    }

    moveEvent({event, start, end}) {
        if(!this.props.editable) return;

        const editable = this.props.editable;
        if (!editable) return;
        
        const { events } = this.state;

        const idx = events.indexOf(event);
        const updatedEvents = { ...event, start, end };

        const nextEvents = [...events];
        nextEvents.splice(idx, 1, updatedEvents);

        this.setState({
            events: nextEvents
        })

        this.updateDocumentEvents();
    }

    onSelectTimes(slotInfo) {
        if(!this.props.editable) return;

        let eventName = window.prompt('Please enter the event name', 'Event');
        if (eventName != null && eventName != "") {
            const eventInfo = {
                'title': eventName,
                'start': slotInfo.start,
                'end': slotInfo.end,
            }
            tmpEvents.push(eventInfo);
            this.setState({
                events: tmpEvents
            });

            this.updateDocumentEvents();
        }
    }

    onSelectSlot(event) {

        if(!this.props.editable) return;

        this.setState({
            selectedEvent: event
        });
        this.openEventEditor();


        // let deleteConfirm = confirm('Do you want to delete the event \"' + event.title + '\"?');

        // if (deleteConfirm == true) {
        //     let newEvents = tmpEvents.filter(el => {
        //         return el != event;
        //     });

        //     tmpEvents = newEvents;
        //     this.setState({
        //         events: tmpEvents
        //     });

        //     this.updateDocumentEvents();
        // }

    }

    updateDocumentEvents() {
        let newDoc = this.props.doc;
        if (!newDoc) newDoc = [];
        newDoc.events = this.state.events;

        this.props.changeDoc(newDoc);
    }

    openEventEditor() {
        this.setState({ showEventModal: true });
    }


    closeEventEditor() {
        this.setState({ showEventModal: false });
    }

    render() {
        return (
            <div>
                <DragAndDropCalendar
                    selectable={this.props.editable && this.props.selectable}
                    events={this.state.events}
                    defaultView='work_week'
                    views={['month', 'work_week']}
                    step={5}
                    min={minDate}
                    max={maxDate}
                    allDayAccessor={'All Day'}
                    // formats={{dayFormat: 'dddd, MMM D, YYYY'}}
                    // scrollToTime={new Date(1970, 1, 1, 6)}
                    onEventDrop={this.moveEvent}
                    onSelectEvent={this.onSelectSlot.bind(this)}
                    onSelectSlot={this.onSelectTimes.bind(this)}
                    style={styles.calendarView}
                    components={{
                        event: MyEvent,
                        work_week: {
                        header: WeekHeader
                        }
                    }}
                />

                <Modal show={this.state.showEventModal} onHide={this.closeEventEditor.bind(this)}>
                    <Modal.Header closeButton>
                    <Modal.Title>Event - {this.state.selectedEvent ? this.state.selectedEvent.title : ''}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <h5>Date: { !this.state.selectedEvent ? moment().format('MMM D, YYYY') : moment(this.state.selectedEvent.start).format('MMM D, YYYY')}</h5>
                    <h5>Current Start Time : { !this.state.selectedEvent ? moment().format('hh:mm A') : moment(this.state.selectedEvent.start).format('hh:mm A') }</h5>
                    <h5>Current End Time : { !this.state.selectedEvent ? moment().format('hh:mm A') : moment(this.state.selectedEvent.end).format('hh:mm A') }</h5>
                    <br/>
                    <p>Start Time: </p>
                    <TimePicker initialValue={ !this.state.selectedEvent ? moment().format("hh:mm") : moment(this.state.selectedEvent.start).format("hh:mm") } start="7:00" end="22:00" step={5} />
                    <br/>
                    <p>End Time: </p>
                    <TimePicker initialValue={ !this.state.selectedEvent ? moment().format("hh:mm") : moment(this.state.selectedEvent.end).format("hh:mm") } start="7:00" end="22:00" step={5} />
                    <br/>
                    <p>Title: </p>
                    <FormControl
                        type="text"
                        value={this.state.selectedEvent ? this.state.selectedEvent.title : ''}
                        placeholder="Enter title"
                        // onChange={this.handleChange}
                    />
                    
                    <hr />
                    </Modal.Body>
                    <Modal.Footer>
                    <Button bsStyle="success" onClick={this.closeEventEditor.bind(this)}>Save</Button>
                    <Button bsStyle="danger" onClick={this.closeEventEditor.bind(this)}>Delete</Button>
                    <Button onClick={this.closeEventEditor.bind(this)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

// export default GDCalendar;
export default DragDropContext(HTML5Backend)(GDCalendar);