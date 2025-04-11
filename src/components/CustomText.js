export function CustomText({type, className, children}) {
	let cName = "text-base font-normal";

	if (type === "medium") {
		cName = "text-lg font-medium";
	}

	if (type === "header") {
		cName = "text-3xl font-bold";
	}

	if (className !== undefined) {
		cName = cName + " " + className;
	}

	return <p className={cName}>{children}</p>;
}
