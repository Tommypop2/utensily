import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";
import { useUtensilContext } from "~/components/UtensilProvider";
import { filterImageHandles, getUtensils, handleToURL } from "~/helpers/files";
import { loadHandle, saveHandle } from "~/helpers/indexedDb";
// TODO: Move IndexedDB code into root or context provider
export default function Home() {
	const utensilCtx = useUtensilContext();
	const navigate = useNavigate();
	const loadFiles = async (handle: FileSystemDirectoryHandle) => {
		const vals = handle.values();
		if (!vals) return;
		const imageHandles = await filterImageHandles(vals);
		const utensils = getUtensils(imageHandles);
		utensilCtx.utensils = utensils;
		navigate("/rank");
	};
	onMount(async () => {
		// Try to load from IndexedDB
		const handle = await loadHandle();
		loadFiles(handle);
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
						saveHandle(handle);
						loadFiles(handle);
					}}
				>
					Open Directory
				</button>
			</div>
		</main>
	);
}
