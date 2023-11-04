import { getEvents, requireLogin } from "@/api";
import {Event} from "@/models";
import EditIcon from 'assets/edit.svg';
import AddIcon from 'assets/add.svg';
import Link from "next/link";

export function EventBox(props: { event: Event }) {
  var date = props.event.date.split("-");
  var sent = props.event.mailSent ? "Mail sent" : "Mail not sent";
  return <div className="flex justify-between flex-wrap gap-y-6 gap-x-8 bg-pink-800 p-6 text-white font-semibold rounded-lg">
      <div className="">
        <h2 className="text-2xl font-bold">{props.event.name}</h2>
        <p>Date : {date[2]} / {date[1]} / {date[0]}</p>
        <p>{sent}</p>
      </div>
      <div className="flex items-center">
        <Link href={`/events/${props.event.uid}`} className="flex gap-2 pe-4 origin-right hover:underline underline-offset-5 hover:text-amber-200 hover:scale-110 ease-in duration-300">
          <EditIcon className="w-6 h-6 fill-current" />
          <p>Edit</p>
        </Link>
      </div>
    </div>;
}

export default function Home(props: { events: Event[] }) {
  return <div className="w-full flex justify-center">
  <div className="flex-grow flex flex-col m-8 max-w-prose text-lg gap-6">
    <h1 className="text-3xl p-5 text-center font-bold">Clicketing</h1>
    {props.events.map(event => <EventBox key={event.uid} event={event}></EventBox>)}
    <div className="p-4">
      <Link href="/events/new" className="flex gap-2 origin-left hover:underline underline-offset-5 hover:text-sky-800 hover:scale-110 ease-in duration-300">
        <AddIcon className="w-8 h-8 stroke-current" />
        <p className="font-semibold">Add New Event</p>
      </Link>
    </div>
  </div>
  </div>;
}

export const getServerSideProps = requireLogin(async (context, session) => {
  return { props: { events: await getEvents(session) } };
});
