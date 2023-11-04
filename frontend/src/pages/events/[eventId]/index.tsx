import {
  createEvent,
  getEvents,
  requireLogin,
  sendEmails,
  sendPreviewEmail,
  updateEvent,
} from "@/api";
import { Event, EventForm } from "@/models";
import { Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";

const validationSchema = yup.object({
  name: yup.string().required(),
  date: yup.date().required(),
  mailTemplate: yup.string(),
});

export default function Event({
  session,
  event,
}: {
  event?: Event;
  session: string;
}) {
  const router = useRouter();
  const [error, setError] = useState(null as string | null);
  const [previewMailRecipient, setPreviewMailRecipient] = useState("");

  async function saveEvent(values: EventForm) {
    if (event) {
      const res = await updateEvent(event?.uid, values, session);

      if (!("uid" in res)) {
        setError(res.description || "An unknown error occurred");
      }
    } else {
      const res = await createEvent(values, session);

      if ("uid" in res) {
        router.push(`/events/${res.uid}`);
      } else {
        setError(res.description || "An unknown error occurred");
      }
    }
  }

  return (
    <div>
      <Formik
        initialValues={{
          name: event?.name || "",
          date: event?.date || "",
          mailTemplate: event?.mailTemplate,
        }}
        onSubmit={saveEvent}
        validationSchema={validationSchema}
      >
        <Form className="flex flex-col">
          <Field name="name" placeholder="Name" />
          <Field name="date" type="date" />
          <Field
            name="mailTemplate"
            type="textarea"
            placeholder="Mail template (in HTML)"
          />
          <button type="submit">{event ? "Save" : "Create"}</button>
        </Form>
      </Formik>
      {event ? (
        <>
          <Link href={`/events/${event.uid}/checkin`}>Checkin</Link>
          <button
            disabled={event.mailSent}
            onClick={() => {
              sendEmails(session, event.uid).then(() => router.reload());
            }}
          >
            Send mail
          </button>
          <input
            onChange={(e) => setPreviewMailRecipient(e.target.value)}
            placeholder="Preview email recipient"
          />
          <button
            onClick={() =>
              (async () => {
                setError(null);

                let email = "";
                try {
                  email =
                    (await yup
                      .string()
                      .email()
                      .required()
                      .validate(previewMailRecipient)) || "";
                } catch (e: any) {
                  setError("Recipient must be a valid email");
                  return;
                }

                let res = await sendPreviewEmail(session, event.uid, email);
                if (typeof res === "object") {
                  setError(res.description || "An unknown error occured");
                }
              })()
            }
          >
            Send preview mail
          </button>
        </>
      ) : (
        <></>
      )}
      {error ? <p>{error}</p> : <></>}
    </div>
  );
}

export const getServerSideProps = requireLogin(async (context, session) => {
  const events = await getEvents(session);
  return {
    props: {
      session,
      event: events.find((e) => e.uid === context.params?.eventId) || null,
    },
  };
});
