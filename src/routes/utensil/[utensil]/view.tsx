import { useParams } from "@solidjs/router";
import { createResource, createSignal, For, onMount, Show } from "solid-js";
import UtensilView from "~/components/UtensilView";
import { handleToURL } from "~/helpers/files";
import { getUtensils } from "~/helpers/opfs";

export default function View() {
	const params = useParams();
	const utensil = () => params.utensil.toLowerCase();
	const [mounted, setMounted] = createSignal(false);

	onMount(() => {
		setMounted(true);
	});
	const [utensils] = createResource(
		mounted,
		async () => {
			const opfs = await navigator.storage.getDirectory();
			const utensilsFolder = await opfs.getDirectoryHandle(utensil());
			// Need to get top and side
			const utensils = await getUtensils(utensilsFolder);
			return utensils;
		},
		{ initialValue: undefined }
	);
	return (
		<div class="grid grid-cols-3 gap-2">
			<For each={utensils()}>
				{(u) => {
					const [src] = createResource(async () => {
						const top = await handleToURL(u.top);
						const side = await handleToURL(u.side);
						return [top, side] as const;
					});
					return (
						<Show when={src()}>
							{(s) => <UtensilView top={s()[0]} side={s()[1]} />}
						</Show>
					);
				}}
			</For>
		</div>
	);
}
