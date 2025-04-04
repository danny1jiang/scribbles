import Link from "next/link";

export function CustomButton({type, onClick, text, href}) {
	let className =
		"flex flex-col justify-center items-center border-solid border-1 rounded-xl border-(--color-primary) w-30 h-12";

	if (type === "primary") {
		className =
			"flex flex-col justify-center items-center bg-(--color-primary) text-white rounded-xl w-30 h-12";
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
