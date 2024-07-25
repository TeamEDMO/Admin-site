//Import tasks from txt file to the html div object in IndividualGroup.hmtl
import { getQueryParam } from './api';
let globalRobotID = getQueryParam('robotID');
let tasksCollection: String[] = [];
export function updateContent() {
    //At the beginning get content from local storage
    fetch('assets/help.txt')
        .then(response => response.text())
        .then(text => {
            const lines = text.split('\n');
            const contentDiv = document.getElementById('HelpList');
            if (contentDiv) {
                
                contentDiv.innerHTML = '';
                
                var margin = document.createElement('div');
                margin.style.marginTop = '1em';

                contentDiv.appendChild(margin)
                //add predefined tasks that cannot be deleted 
                addPredefinedHelp(contentDiv, lines);

                //here add new tasks
                loadTasksFromLocalStorage(contentDiv);

                createTextArea(contentDiv); //TextArea + add button
                const spacer = document.createElement('div');
                spacer.style.padding = '2%';
                spacer.style.borderRadius = '17px';
                contentDiv.appendChild(spacer);

            } else {
                console.error('Element with ID "TaskList" not found.');
            }
        })
        .catch(error => console.error('Error loading text file:', error));
}

function addPersonalText(textstring: string) {
    console.log("i want to push: " + textstring);
    tasksCollection.push(textstring);
    saveTasksToLocalStorage(tasksCollection);
}

function createPersonalizedHelpContainer(textContent: string, fromLocalData: boolean): HTMLElement {
    const div = document.createElement('div');
    div.classList.add("helpInputContainer");
    div.id = textContent;

    const text = document.createElement('button');
    text.textContent = textContent;
    text.id = textContent;
    text.classList.add("card", 'helpButton');
    buttonOnClick(text);

    const iconContainer = document.createElement('div');
    iconContainer.classList.add("card", 'helpIconButton');

    const minusIcon = document.createElement('i');
    minusIcon.className = 'fa-solid fa-minus minusIcon';

    deleteHelpOption(iconContainer);
    iconContainer.appendChild(minusIcon);
    div.appendChild(text);
    div.appendChild(iconContainer);
    //div.appendChild(text);
    if (!fromLocalData) {
        console.log("i want to push: " + textContent);
        tasksCollection.push(textContent);
        saveTasksToLocalStorage(tasksCollection);
    }
    return div;
}
//Retrieve the current EDMO ID that is on this page 

function deleteHelpOption(deleteButton: HTMLElement) {
    deleteButton.addEventListener('click', () => {
        //Find which children of the container was clicked and dispose of that kid

        const parentContainerOfTheButton = deleteButton.parentElement!;

        deleteTaskFromLocalStorage(parentContainerOfTheButton.id);
        updateContent();
    });
}
function createTextArea(container: HTMLElement) {
    const div = document.createElement('div');
    div.classList.add('helpInputContainer');

    const textBox = document.createElement('div');
    textBox.classList.add("textBox");

    const textArea = document.createElement('textarea');
    textArea.classList.add("textBoxInput");
    textArea.id = 'TeacherHelpInput';
    textArea.rows = 4;
    textArea.placeholder = "type personalized help here...";
    textBox.appendChild(textArea);

    const sendButton = document.createElement('i');
    sendButton.classList.add("textBoxIcon", "fa-solid", "fa-plus");
    addSendButtonListener(sendButton, textArea);
    textBox.appendChild(sendButton);

    const gap = document.createElement('div');
    gap.style.padding = "1%";

    div.appendChild(textBox);
    container.appendChild(div);
}
function addPredefinedHelp(contentDiv: HTMLElement, lines: String[]) {
    lines.forEach(line => {
        const div = document.createElement('div');
        div.classList.add('helpInputContainer');

        const helpText = document.createElement('button');
        helpText.textContent = line.trim();
        helpText.id = line.trim();
        helpText.classList.add('card', "helpButton");
        buttonOnClick(helpText);

        div.appendChild(helpText);
        contentDiv.appendChild(div);
    });
}
function addSendButtonListener(button: HTMLElement, textArea: HTMLTextAreaElement) {
    button.addEventListener('click', () => {
        if (textArea.value.trim().length <= 0) {
            console.log("No text!");
            return;
        }
        addPersonalText(textArea.value);
        updateContent();
    });
}
function saveTasksToLocalStorage(tasks: String[]) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function loadTasksFromLocalStorage(container: HTMLElement) {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        // Parse the JSON string into a JavaScript array
        const parsedTasks = JSON.parse(storedTasks);
        tasksCollection = parsedTasks;
        console.log("after loading: " + tasksCollection);
        //initialize tasks stored in local storage
        parsedTasks.forEach((task: string) => {
            let taskElement = createPersonalizedHelpContainer(task, true);
            container.appendChild(taskElement);
        })

    }
}
function deleteTaskFromLocalStorage(taskToDelete: string) {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        // Parse the JSON string into a JavaScript array
        const parsedTasks = JSON.parse(storedTasks);
        parsedTasks.forEach((task: string) => {
            if (task == taskToDelete) {
                console.log("should delete from storage");
                const indexToRemove = tasksCollection.indexOf(task);
                tasksCollection.splice(indexToRemove, 1);
                localStorage.setItem('tasks', JSON.stringify(tasksCollection));
            }
        })
    }
}
function buttonOnClick(helpButton: HTMLButtonElement) {
    helpButton.addEventListener('click', (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.checked) {
            console.log(`Checkbox for ${target.value} is checked`);
        } else {
            console.log(`Checkbox for ${target.value} is unchecked`);
        }
        // Handle the help check
        handleHelpButton(target.id);
    });
}
function handleHelpButton(helpId: string) {
    console.log(`button with ID ${helpId} is was sent for Edmo Group: ${globalRobotID}`);
    //TODO: SEND INFOMRATION WHICH HELP WAS SENT 
}


