



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
import ModalCloser from "../Ui/ModalCloser";

export default function NewClass() {
    const { close } = useModal()
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
            className="flex flex-col justify-center space-y-2 p-4 ">
            <div className="space-y-2">

                <div className="flex justify-between">
                    <h1 className="font-semibold text-xl">
                        new class    </h1>
                    <ModalCloser />
                </div>
                <p className="text-xs text-gray-500">
                    fill the form bellow to create a new class
                </p>
            </div>
            <div className="text-gray-400 flex flex-col  space-y-2 w-full pt-4 ">
                <Input
                    disabled={loading}
                    name="label"
                    placeholder="label"
                    type="text"
                    icon={<InfoCircle size={"small"} />} />

                <Button
                    disabled={loading}
                    type="submit"
                    className="self-end rounded">
                    {loading && <LoaderIcon />} create
                </Button>
            </div>
        </form>
    )
}