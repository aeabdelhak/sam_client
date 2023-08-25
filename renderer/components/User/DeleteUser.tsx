import { CloseSquare } from "react-iconly";
import {  useAppContext } from "../Context/AppContext";
import { useModal } from "../Ui/Modal";
import Button from "../Ui/button/Button";
import { useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import ModalCloser from "../Ui/ModalCloser";
import { useTranslation } from "../../utils/translations/Context";
import { User } from "../Context/SessionConext";

export default function DeleteUser(user: User) {
    const [loading, setloading] = useState(false)
    const translations=useTranslation()
    const {
        users: {
            deleteUser
        }
    } = useAppContext()
    return (
        <div className={" z-0 p-6 bg-gradient-to-br bg-white flex flex-col  rounded-lg gap-4 "}>
            <div className="flex justify-between">
            <h1 className="text-xl ">
                {translations.delete} <b className="text-blue-900">
                    {user.name}
                </b>

            </h1>
            <ModalCloser/>
            </div>
            <p className="text-sm">
                 {translations.deletUserAsk}
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
                        translations.delete
                    }

                </Button>

            </div>
        </div>
    )
}