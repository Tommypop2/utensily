import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "virtual:uno.css";
import { UtensilProvider } from "./components/UtensilProvider";

export default function App() {
	return (
		<UtensilProvider>
			<Router
				root={(props) => (
					<MetaProvider>
						<Title>Utensily</Title>
						<Suspense>{props.children}</Suspense>
					</MetaProvider>
				)}
			>
				<FileRoutes />
			</Router>
		</UtensilProvider>
	);
}
