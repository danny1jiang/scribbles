import Link from "next/link";

export function CustomButton({type, onClick, text, href}) {
	let className = "flex flex-col justify-center items-center ";

	if (type === "primary") {
		className +=
			"bg-(--color-primary) text-white rounded-xl w-30 h-12 hover:bg-[#266ba4] transition duration-150 ease-in-out cursor-pointer";
	} else if (type === "disabled") {
		className += "bg-(--color-gray) text-white rounded-xl w-30 h-12 cursor-not-allowed";
	} else {
		className +=
			"border-solid border-1 rounded-xl border-(--color-primary) w-30 h-12 hover:bg-[#efefef] transition duration-150 ease-in-out cursor-pointer";
	}

	if (href) {
		return (
			<Link className={className} href={href}>
				{text}
			</Link>
		);
	}
	return (
		<button className={className} onClick={onClick}>
			{text}
		</button>
	);
}
