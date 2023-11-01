import { login, requireLogin } from "@/api";
import { SESSION_COOKIE_NAME } from "@/config";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

export default function Login() {
  const router = useRouter();
  const [cookies, setCookie] = useCookies([SESSION_COOKIE_NAME]);

  async function tryLogin(token: string) {
    if (await login(token)) {
      setCookie(SESSION_COOKIE_NAME, token);
      router.push("/");
    }
  }

  return (
    <div className="flex flex-col">
      Login:
      <input
        type="text"
        className="border-2 border-gray-400 w-40 rounded-lg px-2"
        placeholder="Admin token"
        onChange={(e) => tryLogin(e.target.value)}
      />
    </div>
  );
}

export const getServerSideProps = requireLogin(
  async (c) => {
    return { redirect: { destination: "/", permanent: false } };
  },
  async (c) => {
    return { props: {} };
  }
);
