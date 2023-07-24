



import { InfoCircle } from "react-iconly";
import { FormEventHandler, useTransition,  } from "react";
import Router from "next/router";
import { LoaderIcon, toast } from "react-hot-toast";
import fetchApi from "../../utils/fetch";
import Input from "../Ui/Input/Input";
import Button from "../Ui/button/Button";

export default function NewClass({refresh}:{refresh:any}) {
   const [loading,startTransition]=useTransition()
    const newClass: FormEventHandler<HTMLFormElement> = async (ev) => {
        ev.preventDefault();
        const formdata = new FormData(ev.currentTarget)
        const label = formdata.get("label") as string;
        const res = await fetchApi("/create/class", {
            method: "POST",
            body: JSON.stringify({ label }),
            headers: {
                "Content-Type":"application/json"
            }
       
        })
        if (res.classId) {
            await refresh();
            await Router.push("/menu/class/"+res.classId)
            toast.success("Class created successfully")
        }
        else if (res.already) {
            toast.error("another class with same name exists ")
        }
        else toast.error("somthing went wrong")
    }
    return (
        <form
            onSubmit={ev=>startTransition(()=>newClass(ev))}
            className="flex flex-col justify-center space-y-2 p-4 items-center">
            <div className="py-10  font-mono flex justify-center items-center flex-col space-y-2">

                <div className=" text-2xl font-bold ">
                    new student
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
                    {loading && <LoaderIcon/>} create
                </Button>
            </div>
        </form>
    )
}