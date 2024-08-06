import { createResource } from "solid-js";
import { useUtensilContext } from "~/components/UtensilProvider";
import { handleToURL } from "~/helpers/files";
import { computeWinners } from "~/helpers/matchups";

export default function Winner() {
	const utensilCtx = useUtensilContext();
	const winner = computeWinners(
		utensilCtx.matchups(),
		utensilCtx.utensils.length
	);
	const [src] = createResource(() =>
		handleToURL(utensilCtx.utensils[winner[0]].top)
	);
	return <img src={src()} class="h-200"></img>;
}
