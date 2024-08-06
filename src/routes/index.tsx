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
	return (
		<main class="h-full">
			<Title>Utensily</Title>
			<div class="h-full flex flex-col items-center justify-center">
				Utensily!!
				<div>
					<For each={cutlery()}>
						{(c) => (
							<button type="button" onClick={() => navigate(`/utensil/${c}`)}>
								{c}
							</button>
						)}
					</For>
				</div>
			</div>
		</main>
	);
}
