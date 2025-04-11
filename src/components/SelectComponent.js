import {useState} from "react";
import arrowIcon from "@/../public/icons/chevron-down.svg";
import Image from "next/image";
import {AnimatePresence, motion} from "framer-motion";

export function SelectComponent({onChange, options, defaultValue, className}) {
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState(defaultValue);

	function onSelect(option) {
		setSelected(option);
		setOpen(false);
		if (onChange) {
			onChange(option);
		}
	}

	function handleBlur(event) {
		if (!event.currentTarget.contains(event.relatedTarget)) {
			setOpen(false);
		}
	}

	return (
		<div className={className + " z-10"} onBlur={handleBlur}>
			<button
				className={
					"pl-2 pr-2 flex flex-row items-center justify-between w-full h-full cursor-pointer"
				}
				onClick={() => setOpen(!open)}
			>
				{selected}
				<motion.div
					initial={{rotate: 0}}
					animate={{rotate: open ? 180 : 0}}
					transition={{duration: 0.15, type: "tween", ease: "easeInOut"}}
				>
					<Image draggable={false} width={30} height={30} alt="Send" src={arrowIcon} />
				</motion.div>
			</button>
			<AnimatePresence>
				{open ? <OptionList onSelect={onSelect} options={options} /> : null}
			</AnimatePresence>
		</div>
	);
}

function OptionList({options, onSelect}) {
	return (
		<motion.div
			exit={{y: -5, opacity: 0}}
			initial={{y: -5, opacity: 0}}
			animate={{y: 0, opacity: 1}}
			transition={{duration: 0.15, type: "tween", ease: "easeInOut"}}
			className="mt-1 flex flex-col w-full rounded-lg bg-white p-1 shadow-lg"
		>
			{options.map((option, index) => {
				return (
					<button
						key={index}
						className="select-none pl-2 cursor-pointer flex flex-col items-start justify-center h-10 w-full rounded-lg hover:bg-[#efefef] transition duration-150 ease-in-out"
						onClick={() => {
							onSelect(option);
						}}
					>
						{option}
					</button>
				);
			})}
		</motion.div>
	);
}
