import {
	type Accessor,
	createContext,
	createSignal,
	type ParentProps,
	useContext,
} from "solid-js";
import type { Utensil } from "~/helpers/files";
export type Matchup = {
	winner: number;
	loser: number;
};
export type UtensilData = {
	utensils: Utensil[];
	matchups: Accessor<Matchup[]>;
	addMatchup(m: Matchup): void;
};
export const UtensilContext = createContext<UtensilData>();
export const UtensilProvider = (props: ParentProps) => {
	const [matchups, setMatchups] = createSignal<Matchup[]>([]);
	return (
		<UtensilContext.Provider
			value={{
				utensils: [],
				matchups,
				addMatchup(m) {
					setMatchups([...matchups(), m]);
				},
			}}
		>
			{props.children}
		</UtensilContext.Provider>
	);
};
export const useUtensilContext = () => {
	const ctx = useContext(UtensilContext);
	if (!ctx) throw new Error("No context provider in tree!");
	return ctx;
};
