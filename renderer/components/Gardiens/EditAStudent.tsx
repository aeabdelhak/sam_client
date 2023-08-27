import { AnimatePresence, motion } from "framer-motion";
import { config } from "../../utils/fetch";
import { StudentsEntity, useAppContext } from "../Context/AppContext";
import Input from "../Ui/Input/Input";
import Button from "../Ui/button/Button";
import { FormEventHandler, useState, useTransition } from "react";
import { LoaderIcon } from "react-hot-toast";
import { useTranslation } from "../../utils/translations/Context";

export default function EditAStudent({ student }: { student: StudentsEntity }) {
    const [showDelete, setshowDelete] = useState(false)
    const translations=useTranslation()
    const {
        students: {
            updateStudent,
            deleteStudent
        },
        classes: {
            data,

        } } = useAppContext()
    const [deleting, startDeleting] = useTransition()
    const [pending, start] = useTransition()


    const save: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const formdata = new FormData(e.currentTarget)
        formdata.append("studentId", student.id)
        await updateStudent(formdata);
    }
    const deleteMe = () => {
        deleteStudent({ studentId: student.id })
    }

    return (
        <motion.div
            key={student.id}
            exit={{ x: -20, opacity: 0 }}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="sticky space-y-4  flex flex-col rounded-lg top-28">
            <div className=" z-0 p-1 bg-gradient-to-br bg-white flex items-center rounded-lg gap-4">
                <div className="   flex aspect-square w-28 h-w-28  overflow-hidden shrink-0  text-white rounded   justify-center items-center">
                    <img className="object-cover h-full w-full" src={config.remoteImageUrl(student.Image)} alt="" />
                </div>
                <div className="flex flex-1 items-start text-blue-900 space-y-1 flex-col">
                    <p className="font-bold text-lg ">
                        {student.firstName.concat(" ", student.lastName)}
                    </p>
                    <p
                        className=" font-extralight  text-blue-900/80 ">
                        {student.Class.label}
                    </p>
                </div>
            </div>
            <hr />
            <div className="grid grid-cols-2 p-2 rounded-md bg-slate-100">
                <Button
                    disabled={!showDelete}
                    onClick={e => setshowDelete(false)}
                    className="disabled:bg-blue-700 disabled:!text-white bg-transparent !text-gray-500">
                    {translations.information}
                </Button>
                <Button
                    disabled={showDelete}
                    onClick={e => setshowDelete(true)}
                    className="disabled:bg-red-700 disabled:!text-white bg-transparent !text-gray-500">
                    {translations.delete}
                </Button>
            </div>
            <AnimatePresence
                mode="wait"
            >

                {!showDelete ? <motion.form
                    exit={{ x: -20, opacity: 0 }}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    key={"2"}
                    onSubmit={e => {
                        start(() => save(e))
                    }}
                    className="flex  z-10 flex-col gap-2 p-4">
                    <label className="space-y-1">
                        <p className="text-sm ">
                            {translations.firstName}
                        </p>
                        <Input
                            disabled={pending}

                            className="bg-transparent!"
                            name="firstName"
                            defaultValue={student.firstName}
                            placeholder={translations.firstName}
                        />
                    </label>
                    <label className="space-y-1">
                        <p className="text-sm ">
                        {translations.lastName}

                        </p>
                        <Input
                            disabled={pending}

                            defaultValue={student.lastName}
                            name="lastName"
                            placeholder=                            {translations.lastName}
                        />
                    </label>
                    <label className="space-y-1">
                        <p className="text-sm ">
                        {translations.image}

                        </p>
                        <Input
                            name="image"
                            type="file"
                            accept="image/*"
                            disabled={pending}
                            placeholder=                            {translations.image}

                        />
                    </label>
                    <label className="space-y-1">
                        <p className="text-sm ">
                            {translations.class}
                        </p>
                        <div className="rounded-sm flex focus-within:ring-2 items-center  bg-slate-100 ">

                            <select
                                disabled={pending}

                                defaultValue={student.Class.id}
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
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={pending}

                        >
                            {pending ? <LoaderIcon /> : translations.save}
                        </Button>
                    </div>
                </motion.form> :
                    <motion.div
                        key={"1"}
                        exit={{ x: -20, opacity: 0 }}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="space-y-2 p-4 shadow-xl rounded-xl"
                    >
                        <p className="font-extralight">
                            {translations.deleteStudentAsk}
                        </p>
                        <div className="flex justify-end">
                            <Button
                                disabled={deleting}
                                onClick={e => startDeleting(() => deleteMe())}
                                className="bg-red-700 ">
                                {translations.delete}
                            </Button>
                        </div>
                    </motion.div>

                }
            </AnimatePresence>

        </motion.div>
    )
}