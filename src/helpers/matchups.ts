import type { Matchup } from "~/components/UtensilProvider";

const genRandom = (n: number) => Math.floor(Math.random() * n);
/**
 *
 * @param n Number of utensils
 * @returns Random match up
 */
export const generateMatchup = (n: number) => {
	const r1 = genRandom(n);
	let r2 = genRandom(n);
	while (r2 === r1) r2 = genRandom(n);
	return [r1, r2] as const;
};
const indexesOf = <T>(arr: T[], item: T) => {
	const indices = [];
	for (let i = 0; i < arr.length; i++) {
		const v = arr[i];
		if (v === item) indices.push(i);
	}
	return indices;
};
export const computeWinners = (matchups: Matchup[], n: number) => {
	// Array representing each utensil.
	const utensils = Array(n).fill(0);

	for (const m of matchups) {
		utensils[m.winner]++;
	}
	const max = Math.max(...utensils);
	if (max === 0) return [];
	const u = indexesOf(utensils, max);
	return u;
};
