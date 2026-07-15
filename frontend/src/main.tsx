import React from "react";
import ReactDOM from "react-dom/client";
import App from "src/App.tsx";

import "@tabler/core/dist/css/tabler.min.css";
import "@tabler/core/dist/js/tabler.min.js";
import "./App.css";

const dropdownOverflowContainerSelector = ".table-responsive, .overflow-x-auto";
const dropdownOverflowVisibleClass = "dropdown-overflow-visible";

function setDropdownOverflowVisible(target: EventTarget | null, visible: boolean) {
	if (!(target instanceof HTMLElement)) {
		return;
	}

	let element: HTMLElement | null = target;
	while (element) {
		if (element.matches(dropdownOverflowContainerSelector)) {
			element.classList.toggle(dropdownOverflowVisibleClass, visible);
		}
		element = element.parentElement;
	}
}

document.addEventListener("show.bs.dropdown", (event) => {
	setDropdownOverflowVisible(event.target, true);
});

document.addEventListener("hidden.bs.dropdown", (event) => {
	setDropdownOverflowVisible(event.target, false);
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
