import { useNavigate } from "@solidjs/router";
import { createMemo, createResource, Show } from "solid-js";
import ComparisonView from "~/components/ComparisonView";
import { useUtensilContext } from "~/components/UtensilProvider";
import UtensilView from "~/components/UtensilView";
import { handleToURL } from "~/helpers/files";
import { computeWinners, generateMatchup } from "~/helpers/matchups";

export default function Rank() {
	const navigate = useNavigate();
	const utensilCtx = useUtensilContext();
	if (!utensilCtx.utensils.length) {
		navigate("/");
		return;
	}
	const [matchup, { refetch }] = createResource(
		() => generateMatchup(utensilCtx.utensils.length),
		{ ssrLoadFrom: "initial" }
	);
	return (
		<div class="w-full h-full flex flex-col items-center">
			<h1 class="text-5xl">Choose your favourite fork!</h1>
			<ComparisonView matchup={matchup()!} newMatchup={refetch} />
			<button
				type="button"
				class="absolute right-1 bottom-1"
				onClick={() => navigate("/winner")}
			>
				Reveal Winner
			</button>
		</div>
	);
}
