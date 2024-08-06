export const saveHandle = (handle: FileSystemDirectoryHandle) => {
	const req = indexedDB.open("Db", 2);
	req.onupgradeneeded = () => {
		const db = req.result;
		const handles = db.createObjectStore("handlers");
		handles.clear();
		handles.put(handle, "handle");
	};
};
export const loadHandle = () => {
	const req = indexedDB.open("Db");
	const res = new Promise<FileSystemDirectoryHandle>((res, rej) => {
		req.onsuccess = async () => {
			const items = req.result
				.transaction("handlers")
				.objectStore("handlers")
				.get("handle");
			items.onsuccess = async () => {
				const result = items.result as FileSystemDirectoryHandle;
				res(result);
			};
			items.onerror = rej;
		};
		req.onerror = rej;
	});
	return res;
};
