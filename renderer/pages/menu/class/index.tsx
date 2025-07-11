import { useEffect, useState, useTransition } from "react";
import Button from "../../../components/Ui/button/Button";
import fetchApi from "../../../utils/fetch";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import Modal from "../../../components/Ui/Modal";
import NewClass from "../../../components/class/newClassModal";
import Title from "../../../components/Title";
import { useAppContext } from "../../../components/Context/AppContext";
import TheClass from "../../../components/class/Class";
import { useTranslation } from "../../../utils/translations/Context";
let data = null as any[]
export default function Classes() {
    const translations=useTranslation()
    const [showNew, setshowNew] = useState(false)
    const { classes: {
        data, error,
        getData,
    } } = useAppContext()
    useEffect(() => {
        getData()
        return () => {

        }
    }, [])

    return (
        <div className="flex  flex-col p-4">
            <Title
                title={translations.classes}
            />
            <div className="flex mb-6 flex-col gap-4">
                <h1 className="font-semibold text-3xl">
                {translations.classes}
                </h1>
                <p className="text-xs">
                {translations.classesDsc}
                </p>
            </div>

            <Modal closeOnOutsideClick shown={showNew} handler={setshowNew} >
                <NewClass />
            </Modal>
            <div className="col-span-2 rounded-lg bg-slate-50 p-6">
                <div className="flex justify-between pb-6">
                    <h1 className="font-semibold text-xl">
                        {translations.classes}
                    </h1>
                    <div className="">
                        <button
                            onClick={() => setshowNew(true)}
                            className="bg-blue-700 tracking-wide text-sm text-white px-4 py-2 rounded-lg">
                            {translations.createAClass}
                        </button>
                    </div>
                </div>
                <div className="divide-y">

                {data?.map(e => (
                    <TheClass
                    {...e}
                    key={e.id}
                    />
                    ))}
                    </div>
            </div>
        </div>
    )
}

