class HotkeyEngine extends EventTarget {
	/** Stores KeyboardEvent.key strings */
	private currentKeys: Set<string>;
	private timeout: number | undefined;

	static normalize(keyCombination: Set<string> | Array<string>) {
		if (keyCombination instanceof Set)
			keyCombination = Array.from(keyCombination.values());

		return keyCombination
			.map((el) => el.toLowerCase())
			.sort()
			.join("+");
	}

	constructor() {
		super();

		this.currentKeys = new Set();
	}

	onKeydown(e: KeyboardEvent) {
		this.currentKeys.add(e.key);

		if (this.timeout) clearTimeout(this.timeout);
		this.timeout = setTimeout(() => {
			this.currentKeys.clear();
			this.timeout = undefined;
		}, 5000);
	}

	onKeyup(e: KeyboardEvent) {
		let isInputElement = false;
		if (e.target instanceof HTMLElement)
			isInputElement = ["INPUT", "TEXTAREA"].includes(e.target.tagName);

		if (
			/* target is not an input element */
			!isInputElement ||
			/* target is an input element, but there's a modifier key being held */
			(isInputElement &&
				(this.currentKeys.has("Control") || this.currentKeys.has("Alt")))
		) {
			this.dispatchEvent(
				new CustomEvent("hotkey", {
					detail: {
						value: HotkeyEngine.normalize(this.currentKeys),
					},
				})
			);
		}

		this.currentKeys.clear();
		if (this.timeout) clearTimeout(this.timeout);
		this.timeout = undefined;
	}

	private _detach: undefined | (() => void);
	detach() {
		if (this._detach !== undefined) {
			this._detach();
			this._detach = undefined;
		}
	}

	attach(element: HTMLElement) {
		if (!(element instanceof HTMLElement)) throw new Error("Must be element");

		this.detach();

		let boundKeydown = this.onKeydown.bind(this);
		let boundKeyup = this.onKeyup.bind(this);

		this._detach = () => {
			element.removeEventListener("keydown", boundKeydown);
			element.removeEventListener("keyup", boundKeyup);
		};

		element.addEventListener("keydown", boundKeydown);
		element.addEventListener("keyup", boundKeyup);
	}
}
