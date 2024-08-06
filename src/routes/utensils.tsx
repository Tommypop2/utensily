import { createEffect, createResource, For } from "solid-js";
import { useUtensilContext } from "~/components/UtensilProvider";
import UtensilView from "~/components/UtensilView";
import { handleToURL } from "~/helpers/files";

export default function Utensils() {
	const utensilCtx = useUtensilContext();
	return (
		<For each={utensilCtx.utensils}>
			{(u) => {
				const [src] = createResource(async () => [
					await handleToURL(u.top),
					await handleToURL(u.side),
				]);
				const s = src();
				const [top, side] = s ?? ["", ""];
				return <UtensilView top={top} side={side} />;
			}}
		</For>
	);
}
