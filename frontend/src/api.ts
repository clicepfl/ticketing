import assert from "assert";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { ADMIN_TOKEN, API_URL, SESSION_COOKIE_NAME } from "./config";
import { Participant } from "./models";

export type ParticipantInfos = {
  firstName: string;
  surname: string;
  sciper: string;
  group?: string;
};

export function requireLogin<T extends { [key: string]: any }>(
  onSuccess: (
    context: GetServerSidePropsContext,
    token: string
  ) => Promise<GetServerSidePropsResult<T>>,
  onFailure?: GetServerSideProps<T>
): GetServerSideProps<T> {
  return async (context) => {
    const session = context.req.cookies[SESSION_COOKIE_NAME];

    if (session === ADMIN_TOKEN) {
      return await onSuccess(context, session);
    } else {
      return onFailure !== undefined
        ? onFailure(context)
        : { redirect: { destination: "/login", permanent: false } };
    }
  };
}

async function apiCall(
  uri: string,
  { body, token, method }: { body?: any; token?: string; method?: string }
) {
  let headers = {};
  if (body !== undefined) {
    headers = { ...headers, "Content-Type": "application/json" };
  }
  if (token !== undefined) {
    headers = { ...headers, Authorization: `Bearer ${token}` };
  }

  return await fetch(`${API_URL}/${uri}`, {
    method: method || "GET",
    body: body ? JSON.stringify(body) : undefined,
    headers,
  });
}

export async function login(token: string): Promise<boolean> {
  return (await apiCall("login", { body: { token }, method: "POST" })).ok;
}

export async function getEvents(token: string): Promise<Event[]> {
  return await (await apiCall("events", { token })).json();
}

export async function createEvent(
  eventForm: Event,
  token: string
): Promise<Event> {
  return await (
    await apiCall("event", { token, body: eventForm, method: "POST" })
  ).json();
}
export async function updateEvent(
  uid: string,
  eventForm: Event,
  token: string
): Promise<Event> {
  return await (
    await apiCall(`event/${uid}`, { token, body: eventForm, method: "PATCH" })
  ).json();
}
export async function deleteEvent(uid: string, token: string): Promise<Event> {
  return await (
    await apiCall(`event/${uid}`, { token, method: "DELETE" })
  ).json();
}

export async function checkin(
  eventId: string,
  userId: string
): Promise<Participant> {
  return await (
    await apiCall(`event/${eventId}/participants/${userId}/checkin`, {
      method: "POST",
    })
  ).json();
}
