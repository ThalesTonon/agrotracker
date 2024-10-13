import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import pt_br from "@fullcalendar/core/locales/pt-br";
import "./Calendar.css";

const CalendarComponent = (events: any) => {
  return (
    <FullCalendar
      locales={[pt_br]}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      locale="pt-br"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek",
      }}
      events={events}
      eventColor="#88D53D"
      eventDisplay="block"
      displayEventTime={false}
      navLinks={true}
      selectMirror={true}
      aspectRatio={1.75}
      height="auto"
    />
  );
};

export default CalendarComponent;
