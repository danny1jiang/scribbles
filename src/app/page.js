"use client";

import {CustomText} from "@/components/CustomText";
import {ClipboardPen, Shirt, StickyNote} from "lucide-react";
import Link from "next/link";
import {motion} from "framer-motion";
import Image from "next/image";
import ScribblesLogo from "@/../public/ScribblesLogo.png";

export default function Home() {
	return (
		<div className="flex flex-col flex-1 items-center justify-center min-h-screen gap-[4rem] pb-[3rem] font-[family-name:var(--font-geist-sans)] text-center">
			<motion.div
				transition={{duration: 0.5, type: "tween", delay: 0, ease: "easeOut"}}
				animate={{y: 0, opacity: 1}}
				initial={{y: 15, opacity: 0}}
				className="flex flex-col items-center justify-center"
			>
				<Image alt={"Scribbes Logo"} src={ScribblesLogo} width={500} />
				<CustomText type={"header"}>What would you like to order?</CustomText>
				<CustomText type={"medium"}>
					Choose one of the following options to begin your order.
				</CustomText>
			</motion.div>
			<motion.div
				transition={{duration: 0.5, type: "tween", delay: 0.1, ease: "easeOut"}}
				animate={{y: 0, opacity: 1}}
				initial={{y: 5, opacity: 0}}
				className="flex flex-col md:flex-row w-full gap-[3rem] justify-center items-center"
			>
				<Card
					name={"Shirt"}
					image={<Shirt size={80} strokeWidth={1.5} color="white" />}
					description={"Design your own custom shirt with colors, design, and materials."}
					link={"/shirt"}
				/>
				<Card
					name={"Stickers"}
					image={<StickyNote size={80} strokeWidth={1.5} color="white" />}
					description={"Order your own custom sticker in sticker sheets or dye cuts."}
					link={"/stickers"}
				/>
				<Card
					name={"Custom Order"}
					image={<ClipboardPen size={80} strokeWidth={1.5} color="white" />}
					description={"Create a custom order that fits your exact needs."}
					link={"/custom"}
				/>
			</motion.div>
		</div>
	);
}

function Card({name, description, image, link}) {
	return (
		<Link
			className="flex flex-col justify-center items-center border-solid border-1 rounded-xl border-(--color-gray) w-8/10 md:w-5/20 md:h-[30rem] p-[2rem] text-center transition-all duration-200 hover:shadow-md hover:scale-102"
			href={link}
		>
			<div className="mb-[2rem] bg-(--color-primary) rounded-full p-5">{image}</div>
			<CustomText type={"header"}>{name}</CustomText>
			<CustomText type={"medium"}>{description}</CustomText>
		</Link>
	);
}
