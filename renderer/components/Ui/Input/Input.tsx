type props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
export default function Input(props: props & { icon?: JSX.Element }) {

  return (
    <div className="rounded-sm flex focus-within:ring-2 items-center  bg-slate-100 ">
      {props.icon && <div className="w-6 flex justify-center items-center h-full" >
        {props.icon}
      </div>}
      <input {...props} className="appearance-none flex-1 focus:text-gray-900 text-gray-500 outline-none w-full bg-transparent px-2 py-2 text-sm " />
    </div>
  )
}