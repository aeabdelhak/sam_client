



import { InfoCircle } from "react-iconly";
import { FormEventHandler, useTransition, } from "react";
import Router from "next/router";
import { ipcRenderer } from "electron";
import { LoaderIcon, toast } from "react-hot-toast";
import { config } from "process";
import fetchApi from "../../utils/fetch";
import Input from "../Ui/Input/Input";
import Button from "../Ui/button/Button";
import { useAppContext } from "../Context/AppContext";
import { useModal } from "../Ui/Modal";

export default function NewClass() {
    const {close}=useModal()
    const [loading, startTransition] = useTransition()
    const { classes: {
        newClass

    } } = useAppContext()
    const create: FormEventHandler<HTMLFormElement> = async (ev) => {
        ev.preventDefault();
        const formdata = new FormData(ev.currentTarget)
        const label = formdata.get("label") as string;
        const rs = await newClass({ label })
        if (rs) close();
    }
    return (
        <form
            onSubmit={ev => startTransition(() => create(ev))}
            className="flex flex-col justify-center space-y-2 p-4 items-center">
            <div className="py-10  font-mono flex justify-center items-center flex-col space-y-2">

                <div className=" text-2xl font-bold ">
                    new class
                </div>
                <div className=" ">
                    fill the form bellow
                </div>
            </div>

            <div className="text-gray-400 flex flex-col  space-y-2 w-full p-4">
                <Input
                    disabled={loading}
                    name="label"
                    placeholder="label"
                    type="text"
                    icon={<InfoCircle size={"small"} />} />

                <Button
                    disabled={loading}
                    className="self-end rounded">
                    {loading && <LoaderIcon />} create
                </Button>
            </div>
        </form>
    )
}