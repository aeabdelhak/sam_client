import Router from "next/router"
import { toast } from "react-hot-toast"
import { Image } from "../types/class"
import { translation } from "./translations/Context"
import { store } from "../redux/store"
import { setRemote } from "../redux/reducers/config"
import { ipcRenderer } from "electron"

type props = Parameters<typeof fetch>
export class config {
    static async setremoteAddress(str: string) {
        await new Promise((resolve) => {
            store.dispatch(setRemote({ host: str }))
            resolve(true);
        })
    }
    static getremoteAddress() {
        const host = store.getState().config.host
        return host
    }
    static getremoteAddressNuded() {
        return store.getState().config.nudedHost

    }
    static remoteImageUrl(img: Image) {
        return config.getremoteAddress().concat("/", img?.url)
    }
}

export default async function fetchApi(...props: props) {
    const token = await ipcRenderer.sendSync("getToken")
    const url = config.getremoteAddress()
    try {

        const res = await fetch(url + props[0], {
            ...props[1],
            headers: {
                "authorization": `${token}`,
                ...props[1]?.headers,
            }
        })
        if (res.status == 401) {
            localStorage.clear()
            toast.error(translation.getCurrent().sessionTimeOut)
            return Router.replace("/home")
        }
        else if (res.status == 200)
            return await res.json()
        else
            toast(translation.getCurrent().errorMsg)
    } catch (error) {
        toast(translation.getCurrent().errorMsg)
        return {}
    }

}