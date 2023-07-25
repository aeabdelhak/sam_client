import { CloseSquare } from "react-iconly";
import { Class, User, useAppContext } from "../Context/AppContext";
import { useModal } from "../Ui/Modal";
import Button from "../Ui/button/Button";
import { useState } from "react";
import { LoaderIcon } from "react-hot-toast";

export default function DeleteClass(data: Class) {
    const [loading, setloading] = useState(false)
    const { close } = useModal()
    const {
        classes: {
            deleteClass
        }
    } = useAppContext()
    return (
        <div className={" z-0 p-6 bg-gradient-to-br bg-white flex flex-col  rounded-lg  "}>
            <div className="flex justify-between">
                <h1 className="text-xl ">
                    Delete <b className="text-blue-900">
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
                all students within this class will be deleted
            </p>
            <p className="text-sm">
                are you sure you want to delete this class ?
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
                            "delete"
                    }

                </Button>

            </div>
        </div>
    )
}