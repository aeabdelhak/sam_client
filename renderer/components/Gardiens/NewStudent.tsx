import { FormEventHandler, useState, useTransition } from "react";
import { useAppContext } from "../Context/AppContext";
import Input from "../Ui/Input/Input";
import Button from "../Ui/button/Button";
import { useModal } from "../Ui/Modal";

export default function NewStudent({ guardianId }: { guardianId: string }) {
    const { close } = useModal()
    const [pending,setLoading]=useState(false)
    const { students: {
        newStudent
    }, classes: {
        data
    } } = useAppContext()

    const save: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const formdata = new FormData(e.currentTarget)
        formdata.append("guardianId", guardianId)
        setLoading(true)
        const res = await newStudent(formdata);
        if (res) close()
        setLoading(false)

    }

    return (
        <form onSubmit={save} className="p-6 space-y-3">
            <div className="space-y-2">
                <h1 className="font-semibold text-2xl">
                    add a stuent
                </h1>
                <p className="text-sm text-gray-500">
                    fill the form bellow to create a new student
                </p>
            </div>
            <div className="flex flex-col gap-2">
                <label>
                    <p className="text-sm font-bold">
                        first name
                    </p>
                    <Input
                        required
                        name="firstName"
                        disabled={pending}
                        placeholder="student first name"
                    />
                </label>
                <label>
                    <p className="text-sm font-bold">
                        last name
                    </p>
                    <Input
                        required
                        name="lastName"
                        disabled={pending}
                        placeholder="student last name"
                    />
                </label>
                <label>
                    <p className="text-sm font-bold">
                        image
                    </p>
                    <Input
                        required
                        name="image"
                        type="file"
                        accept="image/*"
                        disabled={pending}
                        placeholder="student image"
                    />
                </label>
                <label>
                    <p className="text-sm font-bold">
                        class
                    </p>
                    <div className="rounded-sm flex focus-within:ring-2 items-center  bg-slate-100 ">

                        <select
                            required
                            className="appearance-none flex-1 focus:text-gray-900 text-gray-500 outline-none w-full bg-transparent px-2 py-2 text-sm "
                            name="classId" id="">
                            {data.map(e => (
                                <option value={e.id} key={e.id}>
                                    {e.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </label>
            </div>
            <div className="flex justify-end gap-2">
                <Button
                    onClick={close}
                    disabled={pending}
                    className="!text-gray-700 tracking-wide text-sm active:bg-gray-200 bg-gray-100 px-4 py-2 rounded-lg">
                    close
                </Button>
                <Button
                    disabled={pending}
                    type="submit"
                    className="bg-blue-700 tracking-wide text-sm text-white px-4 py-2 rounded-lg">
                    Create
                </Button>
            </div>
        </form>
    )
}