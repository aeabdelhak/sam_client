import { FormEventHandler, useState, useTransition } from "react";
import { Class, Roles, User, useAppContext } from "../Context/AppContext";
import Input from "../Ui/Input/Input";
import Button from "../Ui/button/Button";
import { useModal } from "../Ui/Modal";
import { AnimatePresence, motion } from "framer-motion";
import { CloseSquare } from "react-iconly";

export default function EditClass(data: Class) {
    const { close } = useModal()
    const [pending, setPending] = useState(false)
    const { classes: {
        updateClass
    } } = useAppContext()

    const save: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const formdata = new FormData(e.currentTarget)
        setPending(true)
        const res = await updateClass({
            classId: data.id,
            label: formdata.get("label").toString(),
        });
        if (res) close()
        setPending(false)
    }

    return (
        <div className="p-6 flex flex-col space-y-3">
            <div className="flex justify-between">
            <h1 className="font-semibold text-2xl">
                    Edit the class name
                </h1>
                <button
                    disabled={pending}

                    onClick={close}
                    className="appearance-none p-1 rounded-md outline-none hover:bg-gray-100">
                    <CloseSquare />
                </button>
            </div>
            <div className="space-y-2">
               
                <p className="text-sm text-gray-500">
                    fill the form bellow to edit the class name
                </p>
            </div>

            <AnimatePresence
                mode="wait"
            >




                <motion.div

                    key={"1"}
                    exit={{ x: -20, opacity: 0 }}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <form
                        onSubmit={save}
                        className="space-y-2 "
                    >


                        <label>
                            <p className="text-sm font-bold">
                                new name
                            </p>
                            <Input
                                defaultValue={data.label}
                                required
                                type="text"
                                name="label"
                                disabled={pending}
                                placeholder="name"
                            />
                        </label>
                        <div className="flex justify-end gap-2">
                            <Button
                                disabled={pending}
                                type="submit">
                                change name
                            </Button>
                        </div>
                    </form>
                </motion.div>


            </AnimatePresence>



        </div>
    )
}