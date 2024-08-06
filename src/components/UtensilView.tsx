export default function UtensilView(props: {
	top?: string;
	side?: string;
	onClick?: () => any;
}) {
	return (
		<div class="flex flex-row" onClick={props.onClick}>
			<img src={props.top} class="w-[50%]" alt="" />
			<img src={props.side} class="w-[50%]" alt="" />
		</div>
	);
}
