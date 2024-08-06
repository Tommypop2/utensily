import type { Utensil } from "./files";
/**
 * Write utensil to OPFS
 * @param opfsRoot Directory handle to the OPFS root
 * @param utensil Utensil to write
 * @returns A new utensil object referencing OPFS
 */
export const writeUtensilToOPFS = async (opfsRoot: FileSystemDirectoryHandle, utensil: Utensil) => {
    const folderName = utensil.name;
    const topBuffer = await (await utensil.top.getFile()).arrayBuffer();
    const sideBuffer = await (await utensil.side.getFile()).arrayBuffer();

    const folder = opfsRoot.getDirectoryHandle(folderName, { create: true });
    const top = await (await folder).getFileHandle("top", { create: true });
    const side = await (await folder).getFileHandle("side", { create: true });
    const topWriter = await top.createWritable();
    const sideWriter = await side.createWritable();
    topWriter.write(topBuffer);
    sideWriter.write(sideBuffer);
    topWriter.close();
    sideWriter.close();
    return { name: utensil.name, top, side } as Utensil
}

export const getUtensils = async (opfsRoot: FileSystemDirectoryHandle) => {
    const utensils: Utensil[] = [];
    for await (const dir of opfsRoot.values()) {
        if (dir.kind === "file") continue;
        utensils.push({
            name: dir.name,
            top: await dir.getFileHandle("top"),
            side: await dir.getFileHandle("side")
        })
    }
    return utensils;
}