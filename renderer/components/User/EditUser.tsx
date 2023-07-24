import { FormEventHandler, useState, useTransition } from "react";
import { Roles, User, useAppContext } from "../Context/AppContext";
import Input from "../Ui/Input/Input";
import Button from "../Ui/button/Button";
import { useModal } from "../Ui/Modal";
import { AnimatePresence, motion } from "framer-motion";

export default function EditUser(data: User) {
    const { close } = useModal()
    const [showPass, setshowPass] = useState(false)
    const [pending, setPending] = useState(false)
    const { user, users: {
        updateUserData,
        updatePassword

    } } = useAppContext()

    const save: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const formdata = new FormData(e.currentTarget)
        setPending(true)
        const res = await updateUserData({
            userId:data.id,
            name: formdata.get("name").toString(),
            username: formdata.get("username").toString(),
            role: formdata.get("role")?.toString() as Roles,
        });
        if (res) close()
        setPending(false)
    }
    const changePass: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        setPending(true)

        const formdata = new FormData(e.currentTarget)
        const res = await updatePassword({
            userId: data.id,
            password: formdata.get("password").toString(),
        });
        if (res) close()
        setPending(false)

    }


    return (
        <div className="p-6 space-y-3">
            <div className="space-y-2">
                <h1 className="font-semibold text-2xl">
                    new user
                </h1>
                <p className="text-sm text-gray-500">
                    fill the form bellow to create a new user
                </p>
            </div>
            <div className="relative grid grid-cols-2 p-2 rounded-md bg-slate-100">
                {pending && <div className="absolute z-10 inset-0 bg-white/50 " />}
                <Button
                    disabled={!showPass}
                    onClick={e => setshowPass(false)}
                    className="disabled:bg-blue-700 disabled:!text-white bg-transparent !text-gray-500">
                    informations
                </Button>
                <Button
                    disabled={showPass}
                    onClick={e => setshowPass(true)}
                    className="disabled:bg-blue-700 disabled:!text-white bg-transparent !text-gray-500">
                    password
                </Button>
            </div>
            <AnimatePresence
                mode="wait"
            >

                {
                    !showPass ?

                        <motion.div
                            exit={{ x: -20, opacity: 0 }}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            key={"2"}

                        >
                            <form
                                onSubmit={ save}
                                className="flex  z-10 flex-col gap-2 ">
                                <div className="flex flex-col gap-2">
                                    <label>
                                        <p className="text-sm font-bold">
                                            name
                                        </p>
                                        <Input
                                            required
                                            defaultValue={data.name}
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
                                            required
                                            defaultValue={data.username}
                                            name="username"
                                            disabled={pending}
                                            placeholder="username"
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
                                                    required
                                                    defaultValue={data.role}
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
                                        disabled={pending}
                                        type="submit">
                                        save
                                    </Button>
                                </div>
                            </form>

                        </motion.div> :
                        <motion.div

                            key={"1"}
                            exit={{ x: -20, opacity: 0 }}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                        >
                            <form
                                onSubmit={changePass}
                                className="space-y-2 "
                            >


                                <label>
                                    <p className="text-sm font-bold">
                                        password
                                    </p>
                                    <Input
                                        required
                                        type="password"
                                        name="password"
                                        disabled={pending}
                                        placeholder="password"
                                    />
                                </label>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        disabled={pending}
                                        type="submit">
                                        change password
                                    </Button>
                                </div>
                            </form>
                        </motion.div>

                }
            </AnimatePresence>



        </div>
    )
}