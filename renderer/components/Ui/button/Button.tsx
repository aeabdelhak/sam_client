import { ipcRenderer } from "electron";
import { ButtonHTMLAttributes } from "react"

type props = React.DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
export default function Button(props: props) {
    return (
        <button {...props}
            onClick={(ev) => {
                props.onClick?.(ev);
                ipcRenderer.send("zoom",true)
            }}
        type={props.type ?? "button"}
            className={"relative active:bg-blue-800 active:scale-95 transition-all bg-blue-700 tracking-wide  text-white px-4 py-2 rounded-lg      text-sm ".concat(props.className)}>
            {props.children}
        </button>
    )
}