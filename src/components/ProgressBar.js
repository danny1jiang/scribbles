export function ProgressBar({progress, className}) {
	const progressBarStyle = {
		width: progress * 100 + "%",
	};

	return (
		<div className={`bg-(--color-light-gray) rounded-full w-full h-1 ${className}`}>
			<div
				className="bg-(--color-secondary) h-full rounded-full transition-all duration-300"
				style={progressBarStyle}
			></div>
		</div>
	);
}
