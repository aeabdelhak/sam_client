import { FormEventHandler, useTransition } from "react";
import { guardian, useAppContext } from "../Context/AppContext";
import Input from "../Ui/Input/Input";
import Button from "../Ui/button/Button";
import { useModal } from "../Ui/Modal";
import ModalCloser from "../Ui/ModalCloser";
import { useTranslation } from "../../utils/translations/Context";

export default function UpdateGuardian(guardian: guardian) {
    const translations = useTranslation()
    const { close } = useModal()
    const [pending, start] = useTransition()
    const { guardians: {
        updateGuardian
    } } = useAppContext()

    const save: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const formdata = new FormData(e.currentTarget)
        const name = formdata.get("name").toString()
        const cardId = formdata.get("cardId").toString()
        const phone = formdata.get("phone").toString()
        const res = await updateGuardian({
            guardianId:guardian.id,
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
                        {translations.updateGuardianInformation2}
                    </h1>
                    <ModalCloser />
                </div>
                <p className="text-sm text-gray-500">
                {translations.updateGuardianDesc}
                </p>
            </div>
            <div className="flex flex-col gap-2">
                <label className="space-y-1">
                    <p className="text-xs font-normal">
                        {translations.guardianName}
                    </p>
                    <Input
                        required
                        name="name"
                        defaultValue={guardian.name}
                        disabled={pending}

                        placeholder={translations.guardianName}
                    />
                </label>
                <label className="space-y-1">
                    <p className="text-xs font-normal">
                    {translations.guardianCardId}

                    </p>
                    <Input
                        required
                        name="cardId"
                        disabled={pending}
                        defaultValue={guardian.cardId}
                        placeholder={translations.guardianCardId}
                    />
                </label>
                <label className="space-y-1">
                    <p className="text-xs font-normal">
                    {translations.phoneNumber}
                    </p>
                    <Input
                        required
                        name="phone"
                        defaultValue={guardian.phoneNumber}

                        disabled={pending}

                        placeholder={translations.phoneNumber}
                    />
                </label>
            </div>
            <div className="flex justify-end gap-2">

                <Button
                    disabled={pending}
                    type="submit"
                    className="bg-blue-700 tracking-wide text-sm text-white px-4 py-2 rounded-lg">
                    {translations.updateGuardianInformation}
                </Button>
            </div>
        </form>
    )
}