import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

// import 'react-big-calendar/lib/addons/dropAndDrop/styles';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

BigCalendar.momentLocalizer(moment);

const DragAndDropCalendar = withDragAndDrop(BigCalendar);

const styles = {
    calendarView: {
        minHeight: '580px',
        flex: 1
    }
}

/*
let tmpEvents = [
    {
        'title': 'All Day Event',
        'allDay': true,
        'start': new Date(2017, 3, 11),
        'end': new Date(2017, 10, 10)
    },

    {
        'title': 'All Day Event',
        // 'allDay': true,
        'start': new Date(2017, 8, 18, 7, 0, 0),
        'end': new Date(2017, 8, 18, 10, 30, 0)
    },

    {
        'title': 'Long Event',
        'start': new Date(2017, 8, 17, 19, 30, 0),
        'end': new Date(2017, 8, 17, 22, 0, 0)
    },

    {
        'title': 'DTS STARTS',
        'start': new Date(2017, 8, 20, 19, 30, 0),
        'end': new Date(2017, 8, 20, 21, 0, 0)
    },
]
*/

let tmpEvents = [];
let minDate = new Date(2017, 9, 24, 7, 0, 0);
let maxDate = new Date(2017, 9, 24, 22, 0, 0);

class GDCalendar extends React.Component {
    constructor (props) {
        super(props);

        tmpEvents = this.props.doc && this.props.doc.events ? this.props.doc.events : [];
        this.state = {
            events : tmpEvents
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

        let deleteConfirm = confirm('Do you want to delete the event \"' + event.title + '\"?');

        if (deleteConfirm == true) {
            let newEvents = tmpEvents.filter(el => {
                return el != event;
            });

            tmpEvents = newEvents;
            this.setState({
                events: tmpEvents
            });

            this.updateDocumentEvents();
        }

    }

    updateDocumentEvents() {
        let newDoc = this.props.doc;
        if (!newDoc) newDoc = [];
        newDoc.events = this.state.events;

        this.props.changeDoc(newDoc);
    }

    render() {
        return (
            <DragAndDropCalendar
                selectable={this.props.editable && this.props.selectable}
                events={this.state.events}
                defaultView='work_week'
                views={['work_week']}
                step={5}
                min={minDate}
                max={maxDate}
                // scrollToTime={new Date(1970, 1, 1, 6)}
                onEventDrop={this.moveEvent}
                onSelectEvent={this.onSelectSlot.bind(this)}
                onSelectSlot={this.onSelectTimes.bind(this)}
                style={styles.calendarView}
            />
        )
    }
}

// export default GDCalendar;
export default DragDropContext(HTML5Backend)(GDCalendar);