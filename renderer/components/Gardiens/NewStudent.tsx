import { FormEventHandler, useState, useTransition } from "react";
import { useAppContext } from "../Context/AppContext";
import Input from "../Ui/Input/Input";
import Button from "../Ui/button/Button";
import { useModal } from "../Ui/Modal";
import { useTranslation } from "../../utils/translations/Context";
import ModalCloser from "../Ui/ModalCloser";

export default function NewStudent({ guardianId }: { guardianId: string }) {
    const { close } = useModal()
    const [pending, setLoading] = useState(false)
    const { students: {
        newStudent
    }, classes: {
        data
    } } = useAppContext()
    const translations = useTranslation()

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
                <div className="flex justify-between items-center">
                    <h1 className="font-semibold text-2xl">
                        {translations.addAStudent}
                    </h1>
                    <ModalCloser />
                </div>
                <p className="text-sm text-gray-500">
                    {translations.addAStudentDesc}
                </p>
            </div>
            <div className="flex flex-col gap-2">
                <label className="space-y-1">
                    <p className="text-xs font-normal">
                        {translations.firstName}
                    </p>
                    <Input
                        required
                        name="firstName"
                        disabled={pending}
                        placeholder={translations.firstName}
                    />
                </label>
                <label className="space-y-1">
                    <p className="text-xs font-normal">
                        {translations.lastName}
                    </p>
                    <Input
                        required
                        name="lastName"
                        disabled={pending}
                        placeholder={translations.lastName}
                    />
                </label>
                <label className="space-y-1">
                    <p className="text-xs font-normal">
                        {translations.image}
                    </p>
                    <Input
                        required
                        name="image"
                        type="file"
                        accept="image/*"
                        disabled={pending}
                        placeholder={translations.image}
                    />
                </label>
                <label className="space-y-1">
                    <p className="text-xs font-normal">
                        {translations.class}
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
                    disabled={pending}
                    type="submit"
                    className="bg-blue-700 tracking-wide text-sm text-white px-4 py-2 rounded-lg">
                    {translations.addAStudent}
                </Button>
            </div>
        </form>
    )
}