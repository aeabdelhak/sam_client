import { FormEventHandler, useTransition } from "react";
import {  useAppContext } from "../Context/AppContext";
import Input from "../Ui/Input/Input";
import Button from "../Ui/button/Button";
import { useModal } from "../Ui/Modal";
import ModalCloser from "../Ui/ModalCloser";
import { Roles, useSession } from "../Context/SessionConext";
import { useTranslation } from "../../utils/translations/Context";

export default function NewUser() {
    const { close } = useModal()
    const [pending, start] = useTransition()
    const translations=useTranslation()
    const {user}=useSession()
    const {  users: {
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
                <div className="flex justify-between">

                <h1 className="font-semibold text-xl">
                    {translations.newUser}
                    </h1>
                    <ModalCloser/>
                </div>
                <p className="text-xs text-gray-500">
                    {translations.newUserDsc}
                </p>
            </div>
            <div className="flex flex-col gap-2">
                <label>
                    <p className="text-sm font-bold">
                        {translations.name}
                    </p>
                    <Input
                        name="name"
                        disabled={pending}
                        placeholder={translations.password}
                    />
                </label>
                <label>
                    <p className="text-sm font-bold">
                        {translations.username}
                    </p>
                    <Input
                        name="username"
                        disabled={pending}
                        placeholder={translations.username}
                    />
                </label>
                <label>
                    <p className="text-sm font-bold">
                        {translations.password}
                    </p>
                    <Input
                        type="password"
                        name="password"
                        disabled={pending}
                        placeholder={translations.password}
                    />
                </label>
                {
                    user.role == Roles.SuperUser &&
                    <label>
                        <p className="text-sm font-bold">
                            {translations.role}
                        </p>
                        <div className="rounded-sm flex focus-within:ring-2 items-center  bg-slate-100 ">

                            <select
                                className="appearance-none flex-1 focus:text-gray-900 text-gray-500 outline-none w-full bg-transparent px-2 py-2 text-sm "
                                name="role" id="">
                                <option value="ClassTeacher">
                                {translations.classTeacher}
                                </option>
                                <option value="Administrator">
                                    {translations.administrator}
                                </option>

                            </select>
                        </div>
                    </label>}
            </div>
            <div className="flex justify-end gap-2">
                <Button
                    disabled={pending}
                    type="submit">
                    {translations.newUser}
                </Button>
            </div>
        </form>
    )
}