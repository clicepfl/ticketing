import { getEvents, requireLogin } from "@/api";
import {Event} from "@/models";
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 fill-current">
            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
          </svg>
          <p>Edit</p>
        </Link>
      </div>
    </div>;
}

export default function Home(props: { events: Event[] }) {
  return <div className="w-full flex justify-center">
  <div className="flex-grow flex flex-col m-8 max-w-prose text-lg">
    <h1 className="text-3xl p-5 text-center font-bold">Clicketing</h1>
    {props.events.map(event => <EventBox key={event.uid} event={event}></EventBox>)}
    <div className="p-4">
      <Link href="/events/new" className="flex gap-2 origin-left hover:underline underline-offset-5 hover:text-sky-800 hover:scale-110 ease-in duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" className="w-8 h-8 stroke-current">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
        </svg>
        <p className="font-semibold">Add New Event</p>
      </Link>
    </div>
  </div>
  </div>;
}

export const getServerSideProps = requireLogin(async (context, session) => {
  return { props: { events: await getEvents(session) } };
});
