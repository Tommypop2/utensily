import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";
import { useUtensilContext } from "~/components/UtensilProvider";
import {
	filterImageHandles,
	handleToURL,
	loadUtensilsFromFiles,
} from "~/helpers/files";
import { loadHandle, saveHandle } from "~/helpers/indexedDb";
import { getUtensils, writeUtensilToOPFS } from "~/helpers/opfs";

export default function Home() {
	const utensilCtx = useUtensilContext();
	const navigate = useNavigate();
	onMount(async () => {
		// Try to load from IndexedDB
		// const handle = await loadHandle();
		// loadFiles(handle);
	});
	return (
		<main class="h-full">
			<Title>Utensily</Title>
			<div class="h-full flex items-center justify-center">
				<button
					type="button"
					class="rounded-1 bg-blue-400 hover:bg-blue-500 h-20 w-30 mt-100 text-dark-800 border-none"
					onClick={async () => {
						const handle = await window.showDirectoryPicker({
							mode: "readwrite",
						});
						const utensils = await loadUtensilsFromFiles(handle);
						if (!utensils) return;
						// saveHandle(handle);
						const opfs = await navigator.storage.getDirectory();
						// TODO: There is a better method of moving files between handles.
						// This was easier as I already had methods for parsing Utensils out of the user's file system
						for (const utensil of utensils) {
							writeUtensilToOPFS(opfs, utensil);
						}
					}}
				>
					Load Utensils Into Utensily
				</button>
				<button
					type="button"
					onClick={async () => {
						const opfs = await navigator.storage.getDirectory();
						const yes = (await getUtensils(opfs)).reverse();
						utensilCtx.utensils = yes;
						navigate("rank");
					}}
				>
					Rank!
				</button>
			</div>
		</main>
	);
}
