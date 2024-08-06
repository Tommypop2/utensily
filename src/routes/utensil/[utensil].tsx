import { Title } from "@solidjs/meta";
import { useNavigate, useParams } from "@solidjs/router";
import { onMount } from "solid-js";
import { useUtensilContext } from "~/components/UtensilProvider";
import {
	loadUtensilsFromFiles,
} from "~/helpers/files";
import { getUtensils, writeUtensilToOPFS } from "~/helpers/opfs";

export default function Utensil() {
	const utensilCtx = useUtensilContext();
	const params = useParams();
	const utensil = () => params.utensil.toLowerCase();
	const navigate = useNavigate();
	onMount(async () => {
		// Try to load from IndexedDB
		// const handle = await loadHandle();
		// loadFiles(handle);
	});
	return (
		<main class="h-full">
			<Title>Utensily - {utensil()}</Title>
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
						const utensilDir = await opfs.getDirectoryHandle(utensil(), {
							create: true,
						});
						// TODO: There is a better method of moving files between handles.
						// This was easier as I already had methods for parsing Utensils out of the user's file system
						for (const utensil of utensils) {
							writeUtensilToOPFS(utensilDir, utensil);
						}
					}}
				>
					Load Utensils Into Utensily
				</button>
				<button
					type="button"
					onClick={async () => {
						const opfs = await navigator.storage.getDirectory();
						const utensilDir = await opfs.getDirectoryHandle(utensil());
						const yes = (await getUtensils(utensilDir)).reverse();
						utensilCtx.utensils = yes;
						navigate("/rank");
					}}
				>
					Rank!
				</button>
			</div>
		</main>
	);
}
