import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Todos from '../components/Todos'

import { api } from "../utils/api";
import CreateTodo from "../components/CreateTodo";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Fullstack Todo App</title>
        <meta name="description" content="full stack todo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0f1235] to-[#090920]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {sessionData && (
            <div className="grid grid-cols-1 gap-4 md:gap-8">
              <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white">
                <h3 className="text-xl-font-bold">Todos</h3>
                <Todos />
                <CreateTodo />
              </div>
            </div>
          )}
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-lg text-white">
                {sessionData && (
                  <span>Logged in as {sessionData.user?.email}</span>
                )}
              </p>
              <button
                className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
                onClick={
                  sessionData ? () => void signOut() : () => void signIn()
                }
              >
                {sessionData ? "Sign out" : "Sign in"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
