import { FormEventHandler, useTransition } from "react";
import { useAppContext } from "../Context/AppContext";
import Input from "../Ui/Input/Input";
import Button from "../Ui/button/Button";
import { useModal } from "../Ui/Modal";
import ModalCloser from "../Ui/ModalCloser";

export default function NewGuardian() {
    const { close } = useModal()
    const [pending, start] = useTransition()
    const { guardians: {
        newGuardian: newGardent
    } } = useAppContext()

    const save: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const formdata = new FormData(e.currentTarget)
        const name = formdata.get("name").toString()
        const cardId = formdata.get("cardId").toString()
        const phone = formdata.get("phone").toString()
        const res = await newGardent({
            cardId,
            name,
            phoneNumber: phone
        })
        if (res) close();
    }

    return (
        <form onSubmit={e => {

            start(() => save(e))

        }} className="p-6 space-y-3">
            <div className="space-y-2">
                <div className="flex justify-between">

                    <h1 className="font-semibold text-2xl">
                        Create a guardian
                    </h1>
                    <ModalCloser />
                </div>
                <p className="text-sm text-gray-500">
                    fill the form bellow to create a new guardians
                </p>
            </div>
            <div className="flex flex-col gap-2">
                <label>
                    <p className="text-sm font-bold">
                        Name
                    </p>
                    <Input
                        name="name"
                        required
                        disabled={pending}

                        placeholder="guardian Name"
                    />
                </label>
                <label>
                    <p className="text-sm font-bold">
                        Card id
                    </p>
                    <Input
                        name="cardId"
                        disabled={pending}
                        required
                        placeholder="guardian card id"
                    />
                </label>
                <label>
                    <p className="text-sm font-bold">
                        Phone number
                    </p>
                    <Input
                        name="phone"
                        required
                        disabled={pending}

                        placeholder="guardian phone number"
                    />
                </label>
            </div>
            <div className="flex justify-end gap-2">
          
                <Button
                    disabled={pending}
                    type="submit"
                    className="bg-blue-700 tracking-wide text-sm text-white px-4 py-2 rounded-lg">
                    Create
                </Button>
            </div>
        </form>
    )
}