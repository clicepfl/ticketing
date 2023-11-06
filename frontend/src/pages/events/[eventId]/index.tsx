import {
  createEvent,
  getEvents,
  requireLogin,
  sendEmails,
  sendPreviewEmail,
  updateEvent,
} from "@/api";
import { Event, EventForm } from "@/models";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, InputHTMLAttributes, useState } from "react";
import * as yup from "yup";
import Editor from "@monaco-editor/react";

const validationSchema = yup.object({
  name: yup.string().max(50).required(),
  date: yup
    .string()
    .matches(/\d{4}-\d{2}-\d{2}/)
    .required(),
  mailTemplate: yup.string().max(10000),
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
  const [eventForm, setEventForm] = useState({
    name: event?.name,
    date: event?.date,
    mailTemplate: event?.mailTemplate,
  } as Partial<EventForm>);

  async function saveEvent() {
    setError(null);

    try {
      let form = await validationSchema.validate(eventForm);

      if (event) {
        const res = await updateEvent(event?.uid, form, session);

        if (!("uid" in res)) {
          setError(res.description || "An unknown error occurred");
        }
      } else {
        const res = await createEvent(form, session);

        if ("uid" in res) {
          router.push(`/events/${res.uid}`);
        } else {
          setError(res.description || "An unknown error occurred");
        }
      }
    } catch (e) {
      let err = e as yup.ValidationError;
      setError(err.message);
    }
  }

  const updateField =
    (name: string) =>
    (value: string | ChangeEvent<HTMLInputElement> | undefined) =>
      setEventForm((form) => ({
        ...form,
        [name]: typeof value === "string" ? value : value?.target?.value || "",
      }));

  return (
    <div className="w-full flex justify-center">
      <div className="flex-grow flex flex-col m-8 max-w-prose text-lg items-center">
        <Link href="/">
          <h1 className="text-3xl p-5 text-center font-bold">Clicketing</h1>
        </Link>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center gap-6">
            <span>Event name:</span>
            <input
              className="border-[3px] border-clic-blue rounded-lg px-2 focus:border-clic-red origin-right outline outline-0 grow"
              placeholder="Name"
              defaultValue={event?.name}
              onChange={updateField("name")}
            />
          </div>
          <div className="flex items-center gap-6">
            <span>Event date:</span>
            <input
              className="border-[3px] border-clic-blue rounded-lg px-2 focus:border-clic-red origin-right outline outline-0 grow"
              type="date"
              defaultValue={event?.date}
              onChange={updateField("date")}
            />
          </div>
          <p>Mail template:</p>
          <Editor
            className="overflow-y-auto min-h-20 border-[3px] border-clic-blue rounded-lg px-2 focus:border-clic-red origin-right outline outline-0"
            height="70vh"
            loading="Loading Mail Template..."
            defaultLanguage="html"
            defaultValue={event?.mailTemplate}
            onChange={updateField("mailTemplate")}
          />
          <p className="text-sm text-center">
            The mail should be in HTML. To display the ticket, add an img tag
            with the "qrcode" class.
          </p>
          {event ? (
            <div className="flex justify-center items-center gap-8">
              <input
                className="border-[3px] border-clic-blue rounded-lg px-2 focus:border-clic-red origin-right outline outline-0"
                onChange={(e) => setPreviewMailRecipient(e.target.value)}
                placeholder="Preview email recipient"
              />
              <button
                className="text-white text-center font-semibold hover:underline underline-offset-5 self-end px-2 py-1 rounded-lg bg-sky-800 hover:scale-105 ease-in duration-300 origin-right"
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
            </div>
          ) : (
            <></>
          )}
          <div className=" mr-10 flex justify-center w-full gap-6">
            {event ? (
              <>
                <Link
                  className="text-white text-2xl text-center font-semibold hover:underline underline-offset-5 self-end px-4 py-2 rounded-lg bg-pink-800 hover:scale-105 ease-in duration-300"
                  href={`/events/${event.uid}/checkin`}
                >
                  Check-in page
                </Link>
                <button
                  className="text-white text-2xl text-center font-semibold hover:underline underline-offset-5 self-end px-4 py-2 rounded-lg bg-sky-800 hover:scale-105 ease-in duration-300"
                  disabled={event.mailSent}
                  onClick={() => {
                    if (confirm("Are you sure you want to send the mails ?")) {
                      sendEmails(session, event.uid).then(() =>
                        router.reload()
                      );
                    }
                  }}
                >
                  Send mail
                </button>
              </>
            ) : (
              <></>
            )}
            <button
              className="text-white text-center text-2xl font-semibold hover:underline underline-offset-5 self-end mr-5 px-4 py-2 rounded-lg bg-green-600 hover:scale-110 ease-in duration-300"
              onClick={(e) => {
                saveEvent();
              }}
            >
              {event ? "Save" : "Create"}
            </button>
          </div>
        </div>

        {error ? <p>{error}</p> : <></>}
      </div>
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
