import Input from "./Ui/Input/Input";

import { Password, User } from "react-iconly"
import Button from "./Ui/button/Button";
import { FormEventHandler, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/router";
import { LoaderIcon, toast } from "react-hot-toast";
import { ipcRenderer } from "electron";
import { config } from "../utils/fetch";
import { useAppContext } from "./Context/AppContext";
import Title from "./Title";
import { useSession } from "./Context/SessionConext";
import { useTranslation } from "../utils/translations/Context";

export default function Login() {
    const translations=useTranslation()
    const [rooting, setrooting] = useState(false)
    const [pending, start] = useTransition()
    const router = useRouter()
    const {setUser}=useSession()
    const authenticate: FormEventHandler<HTMLFormElement> = async (ev) => {
        ev.preventDefault();
        const formdata = new FormData(ev.currentTarget)
        const [username, password] = [formdata.get("username"), formdata.get("password")]

        const res = await fetch(config.getremoteAddress() + "/auth/login", {
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
        else toast.error(translations.wrongCredentials)
    }
    useEffect(() => {
        setUser(undefined)
        ipcRenderer.send("init");
        router.events.on("routeChangeStart", e => setrooting(true))
        router.events.on("routeChangeComplete", e => setrooting(false))

        return () => {
            router.events.off("routeChangeStart", e => setrooting(true))
            router.events.off("routeChangeComplete", e => setrooting(false))
        }
    }, [])
    if (rooting) return <div className="flex h-screen w-screen justify-center items-center">
        <Title title=""/>
        <LoaderIcon className="scale-150" />
    </div>
    return (
        <form onSubmit={ev => start(() => authenticate(ev))} className="flex  flex-col justify-center  items-center">
        <Title title=""/>

            <div className="space-y-2 p-4 flex flex-col items-center max-w-sm w-full">
                

            <div className="py-10  font-mono flex justify-center items-center flex-col space-y-2">
                <div className=" text-2xl font-bold ">
                    SAM
                </div>
                <div className=" ">
                    Students Attendance manager
                </div>
            </div>
            <h1 className="font-bold uppercase">
                {translations.authenticate}
            </h1>
            <div className="text-gray-400 space-y-2 w-full p-4">
                <Input
                    disabled={pending}
                    name="username"
                    placeholder={translations.username}
                    type="text"
                    icon={<User size={"small"} />}
                />
                <Input
                    disabled={pending}
                    name="password"
                    placeholder={translations.password}
                    icon={<Password size={"small"} />}
                />
                    <Button
                        className="w-full !rounded"
                    disabled={pending}

                    type="submit"
                >
                        {pending ? <LoaderIcon /> :
                    translations.authenticate
                    }
                </Button>
            </div>
        </div>
        </form>
    )
}