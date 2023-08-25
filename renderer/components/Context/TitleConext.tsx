import { createContext, useContext, useState } from "react"

type state = {
    title: string,
    setTitle: (s: string) => void,
}
const Context = createContext<state>({
    title: "sam",
    setTitle: () => { }
})
export const useAppTitle = () => useContext(Context);
export default function TitleConext({ children }: any) {
    const [title, settitle] = useState("")

    return (
        <Context.Provider value={{
            setTitle: settitle,
            title
        }}>
            {children}
        </Context.Provider>
    )
}