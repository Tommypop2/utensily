import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";
import { useUtensilContext } from "~/components/UtensilProvider";
import { filterImageHandles, getUtensils, handleToURL } from "~/helpers/files";
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
		const req = indexedDB.open("Db");
		req.onsuccess = async () => {
			const items = req.result
				.transaction("handlers")
				.objectStore("handlers")
				.get("handle");
			items.onsuccess = async () => {
				const res = items.result as FileSystemDirectoryHandle;
				if ((await res.requestPermission()) === "granted") {
					loadFiles(res);
				}
			};
		};
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
						const req = indexedDB.open("Db", 2);
						req.onupgradeneeded = () => {
							const db = req.result;
							const handles = db.createObjectStore("handlers");
              handles.clear();
							handles.put(handle, "handle");
						};
						loadFiles(handle);
					}}
				>
					Open Directory
				</button>
			</div>
		</main>
	);
}
