import { getEvents, requireLogin } from "@/api";

export default function Home(props: { events: Event[] }) {
  return <p>{JSON.stringify(props)}</p>;
}

export const getServerSideProps = requireLogin(async (context, session) => {
  return { props: { events: await getEvents(session) } };
});
