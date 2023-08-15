import Router from "next/router"
import { toast } from "react-hot-toast"

type props = Parameters<typeof fetch>

export const config = {
    remoteAddress: ""
}
export default async function fetchApi(...props: props) {
    const token = localStorage.getItem("authToken")
    const url = `${config.remoteAddress}`
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