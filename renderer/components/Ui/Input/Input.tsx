import { useRef } from "react"

type props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {bodered?:boolean}
export default function Input(props: props & { icon?: JSX.Element }) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div
      onClick={e => {
        
        !ref.current?.disabled && ["date","datetime-local"].includes(props.type) && ref.current?.showPicker?.()
    }}
      className={" flex focus-within:ring-2 items-center   ".concat(props.bodered ? " border rounded text-xs ":"bg-slate-100 text-sm rounded-sm")}>
      {props.icon && <div className="w-6 flex justify-center items-center h-full" >
        {props.icon}
      </div>}
      <input {...props} ref={ref} className="appearance-none flex-1 focus:text-gray-900 text-gray-500 outline-none w-full bg-transparent px-2 py-2  " />
    </div>
  )
}