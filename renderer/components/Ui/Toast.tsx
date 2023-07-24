import { DefaultToastOptions, Toaster } from "react-hot-toast"

const toastOptions: DefaultToastOptions = {
    error: {
        className: ' errorToast ',
    },
    success: {
        className: ' successToast ',

    },
    loading: {
        className: "backdrop-blur",
        style: {
            color: "white",
            background: "rgba(0,0,0,0.2)"
        }
    },
    style: {
        fontSize: ".8rem",
        maxWidth: '20rem',
        width: '100%'
    }
}
export default function Toast() {
  return (
      <Toaster
      toastOptions={toastOptions}
      />
  )
}