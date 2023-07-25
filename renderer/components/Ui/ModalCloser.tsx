import { CloseSquare } from "react-iconly";
import { useModal } from "./Modal";

export default function ModalCloser({ disabled }: { disabled?: boolean }) {
    const {close}=useModal()
  return (
      <button
          type="button"
    disabled={disabled}

    onClick={close}
    className="appearance-none p-1 rounded-md outline-none hover:bg-gray-100">
    <CloseSquare />
</button>
  )
}