import { useEffect } from "react"
import { useAppContext } from "./Context/AppContext"
import { useAppTitle } from "./Context/TitleConext"

export default function Title({ title }: { title: string }) {
    const { setTitle } = useAppTitle()
    useEffect(() => {
        setTitle(title)
    }, [title])

    return null
}