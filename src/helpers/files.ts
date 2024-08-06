export const filterImageHandles = async (
	files: AsyncIterableIterator<
		FileSystemDirectoryHandle | FileSystemFileHandle
	>,
) => {
	const images: FileSystemFileHandle[] = [];
	for await (const file of files) {
		// Check filename
		if (!file.name.endsWith(".jpg")) continue;

		// Check handle kind
		if (file.kind !== "file") continue;
		images.push(file);
	}
	return images;
};
export type Utensil = {
	name: string;
	top: FileSystemFileHandle;
	side: FileSystemFileHandle;
};
export const getFileSystemUtensils = (handles: FileSystemFileHandle[]) => {
	const maybeUtensils: Record<
		string,
		{ top?: FileSystemFileHandle; side?: FileSystemFileHandle }
	> = {};
	for (const handle of handles) {
		const [reducedName, view] = handle.name.split(".")[0].split("-");
		maybeUtensils[reducedName] ||= {};
		maybeUtensils[reducedName][view === "t" ? "top" : "side"] = handle;
	}
	// Map our `maybeUtensils` into the utensils array
	const utensils: Utensil[] = [];
	for (const name of Object.keys(maybeUtensils)) {
		const { top, side } = maybeUtensils[name];
		if (!top) throw new Error(`Expected top view for ${name}`);
		if (!side) throw new Error(`Expected side view for ${name}`);
		utensils.push({ name, top, side });
	}
	return utensils;
};
export const loadUtensilsFromFiles = async (handle: FileSystemDirectoryHandle) => {
	const vals = handle.values();
	if (!vals) return;
	const imageHandles = await filterImageHandles(vals);
	const utensils = getFileSystemUtensils(imageHandles);
	// navigate("/rank");
	return utensils;
};
export const handleToURL = async (handle: FileSystemFileHandle) => {
	const buf = await (await handle.getFile()).arrayBuffer();
	const blob = new Blob([buf]);
	const url = URL.createObjectURL(blob);
	return url;
};
