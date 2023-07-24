"use client"
import { Dialog, Transition } from '@headlessui/react';
import { createContext, Fragment, useContext, useEffect, useState } from 'react';

type props = {
	shown?: boolean;
	disabled?: boolean;
	closeOnOutsideClick?: boolean;
	overflow?: boolean
	handler?: Function;
	w?:
	| 'max-w-lg'
	| 'max-w-xl'
	| 'max-w-2xl'
	| 'max-w-3xl'
	| 'max-w-4xl'
	| 'max-w-sm'
	| 'max-w-md';
	children?: any;
	title?: string;
	description?: string;
	rounded?: "rounded-lg" | "rounded-xl" | "rounded-sm" | "rounded-md" | "rounded-xl" | "rounded-2xl" | "rounded-3xl" | "rounded-4xl" | "rounded-5xl";
};

export const ModalContext = createContext({
	close: () => { },
	changeWidth: (w: props['w']) => { },
	isOverflow: (a: boolean) => { },
	disable: (a: boolean) => { },
})
export const useModal = () => useContext(ModalContext)

export default function Modal(props: props) {
	const [disabled, isdisabled] = useState(props.disabled)
	const [overflow, isOverflow] = useState(props.overflow)
	const [width, setwidth] = useState(props.w)
	function closeModal() {
		props.closeOnOutsideClick && !disabled && props?.handler && props?.handler(false);
	}
	function close() {
		!disabled && props?.handler && props?.handler(false);
	}
	function changeWidth(w: props['w']) {
		setwidth(w)
	}

	useEffect(() => {
		isOverflow(props.overflow)
		isdisabled(props.disabled)
		setwidth(props.w)
	}, [props.w, props.overflow, props.disabled])


	return (
		<ModalContext.Provider value={{ close, changeWidth, isOverflow, disable: isdisabled }}>
			<Transition appear show={props.shown ?? false} as={Fragment}>
				<Dialog
					as='div'
					className='fixed flex flex-col   inset-0 z-[100] '
					onClose={closeModal}>
					<div className='min-h-screen flex justify-center  items-center px-4 '>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0'
							enterTo='opacity-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100'
							leaveTo='opacity-0'>
							<Dialog.Overlay className='fixed inset-0 bg-gray-900 bg-opacity-20 ' />
						</Transition.Child>

						{/* This element is to trick the browser into centering the modal contents. */}
						<span className='inline-block  ' aria-hidden='true'>
							&#8203;
						</span>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'>
							<div
								dir='auto'
								className={`inline-block  !w-full ${width ? width : ' max-w-lg '
									}  my-8    align-middle transition-all  transform dark:text-white  shadow-sm  border-gray-500 dark:border bg-white    ${props.rounded ?? "rounded" }`}>
								<div
									className={`max-h-[calc(100vh-60px)] relative flex flex-col flex-1 ${overflow ? "overflow-y-auto" : ""} `}>
									{props.children}
								</div>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</ModalContext.Provider>
	);
}
