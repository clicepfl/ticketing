import assert from "assert";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { ADMIN_TOKEN, API_URL, SESSION_COOKIE_NAME } from "./config";

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
