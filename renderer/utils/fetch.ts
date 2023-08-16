import Router from "next/router"
import { toast } from "react-hot-toast"
import { Image } from "../types/class"

type props = Parameters<typeof fetch>
export class config {
    private static remoteAddress = ""
    static async setremoteAddress(str: string) {
        await new Promise((resolve) => {
            config.remoteAddress = str
            resolve(true);
        })
    }
    static getremoteAddress() {
        return config.remoteAddress
    }
    static remoteImageUrl(img: Image) {
        return config.getremoteAddress().concat("/", img?.url)
    }
}

export default async function fetchApi(...props: props) {
    const token = localStorage.getItem("authToken")
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
            toast.error("session timeout ")
            return Router.replace("/home")
        }
        if (res.status == 200)
            return await res.json()
    } catch (error) {
        toast(error.status)
        return {}
    }

}