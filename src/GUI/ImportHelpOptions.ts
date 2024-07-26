//Import tasks from txt file to the html div object in IndividualGroup.hmtl
import { getQueryParam, fetchData } from './api';
let globalRobotID = getQueryParam('robotID');
let helpCollection: String[] = [];

export async function updateHelpEntries() {
    const helpLines = await fetchData<string[]>('assets/help.json') ?? [];
    //At the beginning get content from local storage
    const contentDiv = document.getElementById('HelpList');
    if (!contentDiv) {
        console.error('Element with ID "TaskList" not found.');
        return;
    }

    contentDiv.innerHTML = '';

    const newContent: Node[] = [];

    var margin = document.createElement('div');
    margin.style.marginTop = '1em';

    newContent.push(margin);

    //add predefined tasks that cannot be deleted 
    const predefinedHelpElements
        = helpLines.map(s => createPredefinedHelpButton(s.trim()));

    newContent.push(...predefinedHelpElements);

    //here add new tasks
    loadHelpFromStorage();

    const customHelpElements
        = helpCollection.map(s => createPersonalizedHelpButton(s.trim()));

    newContent.push(...customHelpElements);

    newContent.push(createPersonalizeHelpInput());

    contentDiv.replaceChildren(...newContent)
}

function createPredefinedHelpButton(helpLine: string) {
    const button = document.createElement('div');
    button.classList.add('card', "helpButton");
    button.id = helpLine;

    const helpText = document.createElement('span');
    helpText.className = "helpText";
    helpText.textContent = helpLine;
    button.appendChild(helpText);

    button.addEventListener("click", onHelpButtonClicked);

    return button;
}

function createPersonalizedHelpButton(textContent: string): HTMLElement {
    const helpButton = createPredefinedHelpButton(textContent);

    const minusIcon = document.createElement('i');
    minusIcon.className = 'textBoxIcon fa-solid fa-minus minusIcon';
    minusIcon.addEventListener("click", onHelpDeleteClicked);

    helpButton.appendChild(minusIcon);

    return helpButton;
}

function onHelpDeleteClicked(e: Event) {
    const parentContainerOfTheButton = (e.target as HTMLElement).parentElement!;

    helpCollection = helpCollection.filter(h => h != parentContainerOfTheButton.id);
    updateHelpStorage();

    updateHelpEntries();

    // Prevent click from being handled by elements under the icon
    e.stopPropagation();
    e.preventDefault();
}

function createPersonalizeHelpInput() {
    const helpInput = document.createElement('div');
    helpInput.classList.add("textBox");

    const textArea = document.createElement('textarea');
    textArea.classList.add("textBoxInput");
    textArea.rows = 4;
    textArea.placeholder = "Type personalized help here...";
    helpInput.appendChild(textArea);

    const addButton = document.createElement('i');
    addButton.classList.add("textBoxIcon", "fa-solid", "fa-plus");
    addButton.addEventListener("click", e => onHelpAddButtonClicked(textArea));
    helpInput.appendChild(addButton);

    return helpInput;
}

function onHelpAddButtonClicked(textArea: HTMLTextAreaElement) {
    if (textArea.value.trim().length <= 0) {
        console.log("No text!");
        return;
    }

    helpCollection.push(textArea.value);
    updateHelpStorage();
    updateHelpEntries();
}

function updateHelpStorage() {
    let name = 'help';
    localStorage.setItem(name, JSON.stringify(helpCollection));
}

function loadHelpFromStorage() {
    const storedHelp = localStorage.getItem('help');

    if (!storedHelp) return;

    // Parse the JSON string into a JavaScript array
    helpCollection = JSON.parse(storedHelp);
}

function onHelpButtonClicked(event: MouseEvent) {
    const target = event.target as HTMLElement;

    console.log(`button with ID ${target.id} is was sent for Edmo Group: ${globalRobotID}`);
    //TODO: SEND INFOMRATION WHICH HELP WAS SENT 
}