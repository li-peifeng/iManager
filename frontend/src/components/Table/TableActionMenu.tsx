import { IconDotsVertical } from "@tabler/icons-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface MenuPosition {
	left: number;
	top: number;
}

interface TableActionMenuProps {
	children: React.ReactNode;
}

function TableActionMenu({ children }: TableActionMenuProps) {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [position, setPosition] = useState<MenuPosition>({ left: 0, top: 0 });

	const updatePosition = useCallback(() => {
		const button = buttonRef.current;
		const menu = menuRef.current;
		if (!button || !menu) {
			return;
		}

		const margin = 8;
		const gap = 2;
		const buttonRect = button.getBoundingClientRect();
		const menuWidth = menu.offsetWidth;
		const menuHeight = menu.offsetHeight;

		let left = buttonRect.right - menuWidth;
		let top = buttonRect.bottom + gap;

		if (top + menuHeight > window.innerHeight - margin && buttonRect.top - menuHeight - gap >= margin) {
			top = buttonRect.top - menuHeight - gap;
		}

		left = Math.max(margin, Math.min(left, window.innerWidth - menuWidth - margin));
		top = Math.max(margin, Math.min(top, window.innerHeight - menuHeight - margin));

		setPosition({ left, top });
	}, []);

	useLayoutEffect(() => {
		if (isOpen) {
			updatePosition();
		}
	}, [isOpen, updatePosition]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handlePointerDown = (event: PointerEvent) => {
			const target = event.target;
			if (!(target instanceof Node)) {
				return;
			}

			if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) {
				return;
			}

			setIsOpen(false);
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsOpen(false);
				buttonRef.current?.focus();
			}
		};

		window.addEventListener("resize", updatePosition);
		window.addEventListener("scroll", updatePosition, true);
		document.addEventListener("pointerdown", handlePointerDown);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("resize", updatePosition);
			window.removeEventListener("scroll", updatePosition, true);
			document.removeEventListener("pointerdown", handlePointerDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, updatePosition]);

	return (
		<span className="dropdown">
			<button
				ref={buttonRef}
				type="button"
				className="btn dropdown-toggle btn-action btn-sm px-1"
				aria-expanded={isOpen}
				onClick={() => setIsOpen((current) => !current)}
			>
				<IconDotsVertical />
			</button>
			{isOpen
				? createPortal(
						<div
							ref={menuRef}
							className="dropdown-menu dropdown-menu-end show"
							style={{
								left: position.left,
								position: "fixed",
								top: position.top,
								zIndex: 1080,
							}}
							onClick={() => setIsOpen(false)}
						>
							{children}
						</div>,
						document.body,
					)
				: null}
		</span>
	);
}

export { TableActionMenu };
