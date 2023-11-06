import { login, requireLogin } from "@/api";
import { API_URL, SESSION_COOKIE_NAME } from "@/config";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import UserIcon from 'assets/user.svg';
import LockIcon from 'assets/lock.svg';

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
    <div className="w-full flex justify-center">
      <div className="flex-grow flex flex-col m-8 max-w-prose text-lg items-center">
        <h1 className="text-3xl p-5 text-center font-bold">Clicketing</h1>
        <UserIcon className="w-20 h-20 m-4 mb-1 stroke-clic-blue" />
        <h2 className="text-2xl font-semibold text-clic-blue">Admin Login</h2>
        <div className="flex p-3">
          <input
            type="text"
            className="order-2 ease-in duration-300 peer border-[3px] border-clic-blue w-40 rounded-lg px-2 focus:border-clic-red origin-right outline outline-0"
            placeholder="Token"
            onChange={(e) => tryLogin(e.target.value)}
          />
          <LockIcon className="order-1 ease-in duration-300 w-8 h-8 me-1 stroke-2 stroke-clic-blue peer-focus:stroke-clic-red peer-focus:animate-[spin_1s_ease-in-out]" />
        </div>
      </div>
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
