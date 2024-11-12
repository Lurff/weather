import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n.js";
import "primereact/resources/themes/lara-dark-purple/theme.css";

import Layout from "../components/layout/Layout";

import { Provider } from "./Context";

createRoot(document.getElementById("root")).render(
	<Provider>
		<div className="w-full h-screen relative">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				className="absolute w-full h-full inset-0 -z-10"
			>
				<filter id="n" x="0" y="0">
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.5"
						stitchTiles="stitch"
					/>
				</filter>
				<rect width="100%" height="100%" fill="#000" />
				<rect width="100%" height="100%" filter="url(#n)" opacity="0.15" />
			</svg>
			<Layout />
		</div>
	</Provider>
);
