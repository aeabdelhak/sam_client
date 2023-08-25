import { CloseSquare } from "react-iconly";
import { Class, useAppContext } from "../Context/AppContext";
import { useModal } from "../Ui/Modal";
import Button from "../Ui/button/Button";
import { useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import { useTranslation } from "../../utils/translations/Context";

export default function DeleteClass(data: Class) {
    const [loading, setloading] = useState(false)
    const translations=useTranslation()
    const { close } = useModal()
    const {
        classes: {
            deleteClass
        }
    } = useAppContext()
    return (
        <div className={" z-0 space-y-4 p-6 bg-gradient-to-br bg-white flex flex-col  rounded-lg  "}>
            <div className="flex justify-between">
                <h1 className="text-xl ">
                    {translations.delete} <b className="text-blue-900">
                        {data.label}
                    </b>

                </h1>
                <button
                    disabled={loading}

                    onClick={close}
                    className="appearance-none p-1 rounded-md outline-none hover:bg-gray-100">
                    <CloseSquare />
                </button>
            </div>
            <p className="text-xs text-red-600">
                {translations.deleteClassDangerMsg}
            </p>
            <p className="text-sm">
                {translations.deleteClassAsk}
            </p>
            <div className="flex justify-end">
                <Button
                    disabled={loading}
                    className="bg-red-700 "
                    onClick={async e => {
                        setloading(true)
                        await deleteClass({ classId: data.id })
                        setloading(false)
                    }}>
                    {
                        loading ? <LoaderIcon /> :
                            translations.delete
                    }

                </Button>

            </div>
        </div>
    )
}