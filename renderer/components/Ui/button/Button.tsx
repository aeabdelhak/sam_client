import { ButtonHTMLAttributes } from "react"

type props = React.DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
export default function Button(props: props) {
    return (
        <button {...props}
        type={props.type ?? "button"}
            className={"relative bg-blue-700 tracking-wide  text-white px-4 py-2 rounded-lg   font-bold   text-sm ".concat(props.className)}>
            {props.children}
        </button>
    )
}