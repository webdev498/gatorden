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

class GDCalendar extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            events : tmpEvents
        }

        this.moveEvent = this.moveEvent.bind(this);
    }

    moveEvent({event, start, end}) {
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

        alert('${event.title} was dropped onto ${event.start}');
    }

    onSelectTimes(slotInfo) {
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
        }
    }

    onSelectSlot(event) {
        let deleteConfirm = confirm('Do you want to delete the event \"' + event.title + '\"?');

        if (deleteConfirm == true) {
            let newEvents = tmpEvents.filter(el => {
                return el != event;
            });

            tmpEvents = newEvents;
            this.setState({
                events: tmpEvents
            });
        }

    }

    render() {
        return (
            <DragAndDropCalendar
                selectable={this.props.selectable}
                events={this.state.events}
                defaultView='week'
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