



import { InfoCircle } from "react-iconly";
import { FormEventHandler, useState, useTransition, } from "react";
import Router from "next/router";
import { LoaderIcon, toast } from "react-hot-toast";
import fetchApi from "../../utils/fetch";
import Input from "../Ui/Input/Input";
import Button from "../Ui/button/Button";
import ModalCloser from "../Ui/ModalCloser";

export default function NewClass({ refresh }: { refresh: any }) {
    const [loading, setLoading] = useState(false)
    const newClass: FormEventHandler<HTMLFormElement> = async (ev) => {
        ev.preventDefault();
        const formdata = new FormData(ev.currentTarget)
        const label = formdata.get("label") as string;
        setLoading(true)
        const res = await fetchApi("/create/class", {
            method: "POST",
            body: JSON.stringify({ label }),
            headers: {
                "Content-Type": "application/json"
            }

        })
        if (res.classId) {
            await refresh();
            await Router.push("/menu/class/" + res.classId)
            toast.success("Class created successfully")
        }
        else if (res.already) {
            toast.error("another class with same name exists ")
        }
        else toast.error("somthing went wrong")
        setLoading(false)

    }
    return (
        <form
            onSubmit={newClass}
            className="flex flex-col justify-center space-y-2 p-4 items-center">
            <div className="flex justify-between">
                <h1 className="font-semibold text-xl">
                    new class    </h1>
                <ModalCloser />
            </div>


            <div className="text-gray-400 flex flex-col  space-y-2 w-full p-4">
                <Input
                    required
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