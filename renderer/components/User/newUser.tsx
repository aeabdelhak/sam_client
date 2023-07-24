import { FormEventHandler, useTransition } from "react";
import { Roles, useAppContext } from "../Context/AppContext";
import Input from "../Ui/Input/Input";
import Button from "../Ui/button/Button";
import { useModal } from "../Ui/Modal";

export default function NewUser() {
    const { close } = useModal()
    const [pending, start] = useTransition()
    const { user, users: {
        newUser,

    }, classes: {
        data
    } } = useAppContext()

    const save: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const formdata = new FormData(e.currentTarget)
        const res = await newUser({
            name: formdata.get("name").toString(),
            username: formdata.get("username").toString(),
            password: formdata.get("password").toString(),
            role: formdata.get("role")?.toString(),
        });
        if (res) close()
    }

    return (
        <form onSubmit={e => {

            start(() => save(e))

        }} className="p-6 space-y-3">
            <div className="space-y-2">
                <h1 className="font-semibold text-2xl">
                    new user
                </h1>
                <p className="text-sm text-gray-500">
                    fill the form bellow to create a new user
                </p>
            </div>
            <div className="flex flex-col gap-2">
                <label>
                    <p className="text-sm font-bold">
                        name
                    </p>
                    <Input
                        name="name"
                        disabled={pending}
                        placeholder="name"
                    />
                </label>
                <label>
                    <p className="text-sm font-bold">
                        username
                    </p>
                    <Input
                        name="username"
                        disabled={pending}
                        placeholder="username"
                    />
                </label>
                <label>
                    <p className="text-sm font-bold">
                        password
                    </p>
                    <Input
                        type="password"
                        name="password"
                        disabled={pending}
                        placeholder="password"
                    />
                </label>
                {
                    user.role == Roles.SuperUser &&
                    <label>
                        <p className="text-sm font-bold">
                            role
                        </p>
                        <div className="rounded-sm flex focus-within:ring-2 items-center  bg-slate-100 ">

                            <select
                                className="appearance-none flex-1 focus:text-gray-900 text-gray-500 outline-none w-full bg-transparent px-2 py-2 text-sm "
                                name="role" id="">
                                <option value="ClassTeacher">
                                Class teacher
                                </option>
                                <option value="Administrator">
                                    Administrator
                                </option>

                            </select>
                        </div>
                    </label>}
            </div>
            <div className="flex justify-end gap-2">
                <Button
                    onClick={close}
                    disabled={pending}
                    className="!text-gray-700 bg-gray-100 ">
                    close
                </Button>
                <Button
                    disabled={pending}
                    type="submit">
                    Create
                </Button>
            </div>
        </form>
    )
}