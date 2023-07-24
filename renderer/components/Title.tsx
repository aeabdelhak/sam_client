import { useEffect } from "react"
import { useAppContext } from "./Context/AppContext"

export default function Title({ title }: { title: string }) {
    const { setTitle } = useAppContext()
    useEffect(() => {
        setTitle(title)
    }, [title])

    return null
}