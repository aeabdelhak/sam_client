import Input from "./Ui/Input/Input";

import { Password, User } from "react-iconly"
import Button from "./Ui/button/Button";
import { FormEventHandler, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/router";
import { LoaderIcon, toast } from "react-hot-toast";
import { ipcRenderer } from "electron";
import { config } from "../utils/fetch";

export default function Login() {
    const [rooting, setrooting] = useState(false)
    const [pending, start] = useTransition()
    const router = useRouter()
    const authenticate: FormEventHandler<HTMLFormElement> = async (ev) => {
        ev.preventDefault();
        const formdata = new FormData(ev.currentTarget)
        const [username, password] = [formdata.get("username"), formdata.get("password")]

        const res = await fetch(config.remoteAddress + "/auth/login", {
            method: "POST",
            body: JSON.stringify({ password, username }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        if (data.success) {
            localStorage.setItem("authToken", data.token)
            router.replace("/menu")
            ipcRenderer.send("loginSuccess")
        }
        else toast.error("wrong username or password")
    }
    useEffect(() => {
        ipcRenderer.send("init");
        router.events.on("routeChangeStart", e => setrooting(true))
        router.events.on("routeChangeComplete", e => setrooting(false))

        return () => {
            router.events.off("routeChangeStart", e => setrooting(true))
            router.events.off("routeChangeComplete", e => setrooting(false))
        }
    }, [])
    if (rooting) return <div className="flex h-screen w-screen justify-center items-center">
        <LoaderIcon className="scale-150" />
    </div>
    return (
        <form onSubmit={ev => start(() => authenticate(ev))} className="flex flex-col justify-center space-y-2 p-4 items-center">

            <div className="py-10  font-mono flex justify-center items-center flex-col space-y-2">
                <div className=" text-2xl font-bold ">
                    SAM
                </div>
                <div className=" ">
                    Students Attendance manager
                </div>
            </div>
            <h1 className="font-bold uppercase">
                authenticate
            </h1>
            <div className="text-gray-400 space-y-2 w-full p-4">
                <Input
                    disabled={pending}
                    name="username"
                    placeholder="username"
                    type="text"
                    icon={<User size={"small"} />}
                />
                <Input
                    disabled={pending}
                    name="password"
                    placeholder="password"
                    type="password"
                    icon={<Password size={"small"} />}
                />
                <Button
                    disabled={pending}

                    type="submit"
                >
                    {pending ? <LoaderIcon/>:"sign in"}
                </Button>
            </div>
        </form>
    )
}