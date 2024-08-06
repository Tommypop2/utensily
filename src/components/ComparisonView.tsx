import { useNavigate } from "@solidjs/router";
import { Accessor, createMemo, createResource, Show } from "solid-js";
import { useUtensilContext } from "~/components/UtensilProvider";
import UtensilView from "~/components/UtensilView";
import { handleToURL } from "~/helpers/files";
import { computeWinners, generateMatchup } from "~/helpers/matchups";

export default function ComparisonView(props: {
	matchup: readonly [number, number];
	newMatchup(): void;
}) {
	const navigate = useNavigate();
	const utensilCtx = useUtensilContext();
	const utensils = () => utensilCtx.utensils;
	if (!utensilCtx.utensils.length) {
		navigate("/");
		return;
	}
	const matchup = () => props.matchup;
	const [src] = createResource(matchup, async ([a, b]) => {
		return await Promise.all([
			await handleToURL(utensils()[a].top),
			await handleToURL(utensils()[a].side),
			await handleToURL(utensils()[b].top),
			await handleToURL(utensils()[b].side),
		]);
	});
	const latest = createMemo(() => {
		const v = src.latest;
		if (v) return v;
		return ["", "", "", ""] as [string, string, string, string];
	});
	const winners = createMemo(() => {
		const r = computeWinners(utensilCtx.matchups(), utensilCtx.utensils.length);
		return r;
	});
	return (
		<>
			<div class="flex flex-row w-full gap-5 h-full">
				<UtensilView
					top={latest()[0]}
					side={latest()[1]}
					onClick={() => {
						const m = matchup()!;
						const w = m[0];
						const l = m[1];
						utensilCtx.addMatchup({ winner: w, loser: l });
						props.newMatchup();
					}}
				/>
				<UtensilView
					top={latest()[2]}
					side={latest()[3]}
					onClick={() => {
						const m = matchup()!;
						const l = m[0];
						const w = m[1];
						utensilCtx.addMatchup({ winner: w, loser: l });
						props.newMatchup();
					}}
				/>
			</div>
			{(() => {
				const w = winners();
				if (w.length === 0) return "No fork is winning";
				if (w.length === 1) return `Fork ${w[0]} is winning`;
				return `Forks ${w.join(", ")} are winning`;
			})()}
		</>
	);
}
