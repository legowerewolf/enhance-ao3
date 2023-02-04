function getElement(selector) {
    let element = document.querySelector(selector);
    if (element === null)
        throw new Error(`no element found for selector: "${selector}"`);
    return element;
}
const click = (selector) => () => {
    let element = getElement(selector);
    element.click();
};
const setProperty = (selector, attribute, value) => () => {
    let element = getElement(selector);
    element[attribute] = value;
};
const setAttribute = (selector, attribute, value) => () => {
    let element = getElement(selector);
    element.setAttribute(attribute, value);
};
const appendText = (selector, text) => () => {
    let element = getElement(selector);
    if (element instanceof HTMLInputElement) {
        element.value += text;
    }
    else if (element instanceof HTMLTextAreaElement) {
        element.value += text;
    }
    else {
        throw new Error(`selected element is not an input or textarea: "${selector}": ${element}`);
    }
};
const doSequence = (...actions) => () => {
    for (let action of actions) {
        try {
            action();
        }
        catch (e) {
            console.error(e);
            break;
        }
    }
};
const doFirst = (...actions) => () => {
    for (let action of actions) {
        try {
            action();
            return;
        }
        catch (e) { }
    }
};
