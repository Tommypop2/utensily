import { createResource } from "solid-js";
import { useUtensilContext } from "~/components/UtensilProvider";
import { handleToURL } from "~/helpers/files";
import { computeWinner } from "~/helpers/matchups";

export default function Winner() {
	const utensilCtx = useUtensilContext();
	const winner = computeWinner(
		utensilCtx.matchups(),
		utensilCtx.utensils.length
	);
	const [src] = createResource(() =>
		handleToURL(utensilCtx.utensils[winner].top)
	);
	return <img src={src()} class="h-200"></img>;
}
