import { CloseSquare } from "react-iconly";
import { User, useAppContext } from "../Context/AppContext";
import { useModal } from "../Ui/Modal";
import Button from "../Ui/button/Button";
import { useState } from "react";
import { LoaderIcon } from "react-hot-toast";

export default function DeleteUser(user: User) {
    const [loading, setloading] = useState(false)
    const { close } = useModal()
    const {
        users: {
            deleteUser
        }
    } = useAppContext()
    return (
        <div className={" z-0 p-6 bg-gradient-to-br bg-white flex flex-col  rounded-lg gap-4 "}>
            <div className="self-end">
                <button
                    disabled={loading}

                    onClick={close}
                    className="appearance-none p-1 rounded-md outline-none hover:bg-gray-100">
                    <CloseSquare />
                </button>
            </div>
            <h1 className="text-xl ">
                Delete <b className="text-blue-900">
                    {user.name}
                </b>

            </h1>
            <p className="text-sm">
                are you sure you want to delete this user ?
            </p>

            <div className="flex justify-end">
                <Button
                    disabled={loading}
                    className="bg-red-700 "
                    onClick={async e => {
                        setloading(true)
                        await deleteUser({ id: user.id })
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