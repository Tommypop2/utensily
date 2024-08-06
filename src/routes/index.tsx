import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { createSignal, For, onMount } from "solid-js";
import { useUtensilContext } from "~/components/UtensilProvider";

export default function Home() {
	const utensilCtx = useUtensilContext();
	const navigate = useNavigate();
	const [cutlery, setCutlery] = createSignal<string[]>([]);
	onMount(async () => {
		const opfs = await navigator.storage.getDirectory();
		const keys = opfs.keys();
		const cutl: string[] = [];
		for await (const k of keys) cutl.push(k);
		setCutlery(cutl);
	});
	const [newCutleryName, setNewCutleryName] = createSignal<string | null>(null);
	return (
		<main class="h-full">
			<Title>Utensily</Title>
			<div class="h-full flex flex-col items-center justify-center">
				My Cutlery Drawer
				<div class="border-black border border-solid w-50 flex flex-col items-center">
					<For each={cutlery()}>
						{(c) => (
							<button type="button" onClick={() => navigate(`/utensil/${c}`)}>
								{c}
							</button>
						)}
					</For>
				</div>
				<form
					onSubmit={(e) => {
						e.stopPropagation();
						e.preventDefault();
						console.log("Submitted");
						if (!newCutleryName()) return;
						navigate(`/utensil/${newCutleryName()}`);
					}}
				>
					<input
						placeholder="New utensil"
						onInput={(e) => setNewCutleryName(e.target.value)}
					/>
					<button type="submit">Add utensil</button>
				</form>
			</div>
		</main>
	);
}
