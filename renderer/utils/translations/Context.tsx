import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import ar from "./ar"
import en from "./ en"
import fr from "./fr"

export class translation {
    static getCurrent() {
        const saved = localStorage.getItem("language")
        if (saved == "ar") return ar
        if (saved == "fr") return fr
        else return en
    }
    static set(code: string) {
        localStorage.setItem("language", code)
        window.dispatchEvent(new Event("languageChange"))
        return this.getCurrent()

    }
}

const Context = createContext<ReturnType<typeof translation.getCurrent>>(en)
export const useTranslation = () => useContext(Context);
export default function TranslationsContext({ children }: { children: ReactNode }) {
    const [translations, settranslations] = useState(translation.getCurrent())
    useEffect(() => {
        window.addEventListener("languageChange", () => settranslations(translation.getCurrent()))

        return () => {
            window.removeEventListener("languageChange", () => settranslations(translation.getCurrent()))

        }
    }, [])

    return (
        <Context.Provider value={translations}>
            <main dir={translations.dir}>
                {children}
            </main>
        </Context.Provider>
    )
}