import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-row gap-[32px] row-start-2 items-center sm:items-start">
				<Card name={"Stickers"} link={"/stickers"} />
				<Card name={"Shirt"} link={"/shirt"} />
				<Card name={"Custom Order"} link={"/shirt"} />
			</main>
		</div>
	);
}

function Card({name, link}) {
	return (
		<Link
			className="flex flex-col justify-center items-center border-solid border-1 rounded-xl border-(--color-primary) w-[200px] h-[200px]"
			href={link}
		>
			{name}
		</Link>
	);
}
