import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal, { useModal } from "./Ui/Modal";
import ModalCloser from "./Ui/ModalCloser";
import Button from "./Ui/button/Button";
import Input from "./Ui/Input/Input";
import { LoaderIcon, toast } from "react-hot-toast";
import { ChevronLeft } from "react-iconly";
import { config } from "../utils/fetch";
import { ipcRenderer } from "electron";
import { useTranslation } from "../utils/translations/Context";

export default function IpSettings({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
    const [auto, setauto] = useState(true)
    const [step, setstep] = useState(0)
    const translations = useTranslation()

    return (
        <Modal shown={open} handler={setOpen}>
            <div className="p-6 space-y-3">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <h1 className="font-semibold text-xl">
                            {translations.ipConfigurations}
                        </h1>
                        <ModalCloser />
                    </div>
                    <p className="text-xs text-gray-500">
                    </p>
                </div>
                {step == 0 && <div className="">
                    <div
                        className="hover:bg-gray-100 cursor-pointer rounded-lg"
                        onClick={e => setauto(true)}

                    >
                        <div className="flex  flex-col items-start">
                            <div className="flex gap-2 items-center">
                                <input checked={auto} hidden type="radio" className="peer" name="mode" id="" />

                                <div className=" peer-checked:bg-blue-600 p-[6px] border-2 rounded-full">

                                </div>
                                {translations.auto}
                            </div>
                            <p className="text-sm font-extralight px-5">
                                {translations.autoDesc}
                            </p>
                        </div>
                    </div>
                    <div
                        className="hover:bg-gray-100 cursor-pointer rounded-lg"
                        onClick={e => setauto(false)}
                    >
                        <div className="flex  flex-col items-start">
                            <div className="flex gap-2 items-center">
                                <input checked={!auto} hidden type="radio" className="peer" name="mode" id="" />

                                <div className=" peer-checked:bg-blue-600 p-[6px] border-2 rounded-full">

                                </div>
                                {translations.manual}
                            </div>
                            <p className="text-sm font-extralight px-5">
                                {translations.manualDesc}
                            </p>
                        </div>
                    </div>


                    <div className="flex justify-end pt-4">

                        <Button
                            onClick={() => setstep(1)}
                        >
                            {translations.next}
                        </Button>
                    </div>
                </div>}
                {step == 1 && !auto && <Manual setstep={setstep} />}
                {step == 1 && auto && <AutoLockup setStep={setstep} />}
            </div>
        </Modal>
    )
}

function Manual({ setstep }: { setstep: any }) {
    const [loading, setloading] = useState(false)
    const { close } = useModal()
    const translations = useTranslation()
    return <form
        onSubmit={async e => {
            e.preventDefault()
            const remote = (new FormData(e.currentTarget)).get("remote") as string
            setloading(true)

            const data = await ipcRenderer.sendSync("setRemoteIp", remote)
            if (data) {
                await config.setremoteAddress(remote)
                close()
            }
            else {
                toast.error("unable to find a server within the ip/host you provided ")

            }

            setloading(false)

        }}
        className="p-6 space-y-5">
        <div className="flex   flex-col items-start">
            <button
                type="button"
                onClick={() => setstep(0)}>
                <ChevronLeft />
            </button>
            <div className="flex gap-2 items-center">
                {translations.manual}
            </div>
            <p className="text-sm font-extralight ">
                {translations.manualDesc}
            </p>
        </div>
        <Input
            disabled={loading}
            required
            name="remote"
            placeholder="remote ip/host"
        />
        <div className="flex justify-end ">
            {loading && <LoaderIcon />}
            <Button
                disabled={loading}

                type="submit">
                {translations.save}
            </Button>

        </div>
    </form>
}

function AutoLockup({ setStep }: { setStep: any }) {
    const [loading, setloading] = useState(true)
    const { close } = useModal()
    const translations = useTranslation()
    async function lockUp() {
        setloading(true)
        const found = await ipcRenderer.sendSync("remoteLockUp")
        if (found) {
            await config.setremoteAddress(found)
            return close()
        }
        else toast.error("unable to find a server within your network")
        setStep(0)
        setloading(false)
    }
    useEffect(() => {
        const timeout=setTimeout(() => {
            lockUp()
        }, 500);
        return () => {
            clearTimeout(timeout)
        }
    }, [])

    return <form className="p-6 space-y-5">
        <div className="flex   flex-col items-start">
            <div className="flex gap-2 items-center">
                {translations.auto}
            </div>
            <p className="text-sm font-extralight ">
                {translations.autoDesc}
            </p>
        </div>
        <div className="flex justify-center items-center scale-[4]">
            {loading &&
                <LoaderIcon />
            }
        </div>
    </form>
}