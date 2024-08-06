import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { useUtensilContext } from "~/components/UtensilProvider";
import { filterImageHandles, getUtensils, handleToURL } from "~/helpers/files";

export default function Home() {
	const utensilCtx = useUtensilContext();
	const [img, setImg] = createSignal("");
	const navigate = useNavigate();
	return (
		<main class="h-full">
			<Title>Utensily</Title>
			<img src={img()} style={{ width: "50%" }}></img>
			<button
				type="button"
				onClick={async () => {
					const handle = await window.showDirectoryPicker({
						mode: "readwrite",
					});
					const vals = handle.values();
					if (!vals) return;
					const imageHandles = await filterImageHandles(vals);
					const utensils = getUtensils(imageHandles);
					utensilCtx.utensils = utensils;
				}}
			>
				Open Directory
			</button>
			<button
				onClick={async () => {
					// setImg(await handleToURL(utensilCtx.utensils[0].top));
					navigate("rank");
				}}
			>
				Click me!
			</button>
		</main>
	);
}
