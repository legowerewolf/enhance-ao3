function getElement(selector: string): HTMLElement {
	let element: HTMLElement = document.querySelector(selector);
	if (element === null)
		throw new Error(`no element found for selector: ${selector}`);
	return element;
}

const click = (selector: string) => () => {
	let element = getElement(selector);
	element.click();
};

const setProperty = (selector: string, attribute: string, value: any) => () => {
	let element = getElement(selector);
	element[attribute] = value;
};

const doSequence =
	(...actions: CallableFunction[]) =>
	() => {
		for (let action of actions) {
			try {
				action();
			} catch (e) {
				console.error(e);
				break;
			}
		}
	};
