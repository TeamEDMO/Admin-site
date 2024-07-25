import { fetchGroupInfo, getQueryParam, GroupInfo } from './api';
import { updateContent } from './ImportHelpOptions';
const robotID = getQueryParam('robotID');
const pageHeader = document.getElementById('pageHeader');
const userNames = document.getElementById('userNameText');
const helpAmount = document.getElementById("helpText");

var groupInfo: GroupInfo;

async function getGroupInfo() {
    if (!robotID)
        return await fetchGroupInfo("null");

    return await fetchGroupInfo(robotID);
}

async function updateGroupInfo(firstLoad: boolean = false) {
    groupInfo = await getGroupInfo();

    updateGroupInformation();
    await createTasks();
    await loadHelpSection(firstLoad);
}

function updateGroupInformation() {
    if (!pageHeader || !userNames) {
        console.error('Element with ID "pageHeader" not found or Robot ID not found in query parameters.');
        return;
    }

    pageHeader.innerHTML = groupInfo.robotID;

    if (groupInfo.players.length == 0) {
        userNames.innerHTML = "No players are here";
    }
    else {
        const groupMembers = groupInfo.players.map(p => p.name).join(",");
        userNames.innerHTML = groupMembers;
    }
}

//#region tasks
let tasksCollection: String[] = [];
export async function createTasks() {
    let tasks = (await (await fetch('assets/tasks.txt')).text()).split('\n').map(s => s.trim())

    // add the loop
    const contentDiv = document.getElementById('TaskList');

    var taskCards: Node[] = []

    if (!contentDiv) {
        console.error('Element with ID "TaskList" not found.');
        return;
    }

    loadCompletedTasks();

    var taskCards: Node[] = []

    const Headline = document.createElement('h2'); //Create the headline for the container 
    Headline.textContent = "Task List";
    taskCards.push(Headline);

    tasks.forEach(task => {
        // Container that hold the checkbox and Text
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('taskDiv');

        const checkboxdiv = document.createElement('div');
        checkboxdiv.style.marginRight = '2%';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = task; //Line as checkbox task ID + add EDMO ID?
        checkbox.checked = tasksCollection.includes(task)
        checkboxdiv.appendChild(checkbox);

        const taskText = document.createElement('p');
        taskText.textContent = task;

        taskDiv.replaceChildren(checkbox, taskText);
        taskCards.push(taskDiv);

        checkbox.addEventListener('change', onCheckboxStateChanged);
    })

    contentDiv.replaceChildren(...taskCards);
}

function onCheckboxStateChanged(event: Event) {
    var target = event.target as HTMLInputElement;

    if (target.checked) {
        console.log(`Checkbox for ${target.value} is checked`);
        tasksCollection.push(target.id);
        saveCompletedTasks(tasksCollection);
    } else {
        console.log(`Checkbox for ${target.value} is unchecked`);
        //delete from local storage
        deleteCompletedTasks(target.id);
    }

    handleCheckboxChange(target.id, target.checked);
}


function handleCheckboxChange(taskId: string, isChecked: boolean) {
    //TODO: Stuff
    console.log(`Checkbox with ID ${taskId} is now ${isChecked ? 'checked' : 'unchecked'} for Edmo Group: ${robotID}`);
}

function saveCompletedTasks(tasks: String[]) {
    let name = 'taskComplete' + robotID;
    localStorage.setItem(name, JSON.stringify(tasks));
}

function deleteCompletedTasks(taskToDelete: string) {
    let name = 'taskComplete' + robotID;
    const storedTasks = localStorage.getItem(name);
    if (storedTasks) {
        // Parse the JSON string into a JavaScript array
        const parsedTasks = JSON.parse(storedTasks);
        parsedTasks.forEach((task: string) => {
            if (task == taskToDelete) {
                console.log("should delete from storage");
                const indexToRemove = tasksCollection.indexOf(task);
                tasksCollection.splice(indexToRemove, 1);
                localStorage.setItem(name, JSON.stringify(tasksCollection));
            }
        })
    }
}
function loadCompletedTasks() {
    let name = 'taskComplete' + robotID;
    const storedTasks = localStorage.getItem(name);
    if (storedTasks) {
        tasksCollection = JSON.parse(storedTasks);
        const concatenatedString = tasksCollection.join(',');
        console.log(concatenatedString);
    }
}

//#endregion

//#region help

async function loadHelpSection(firstLoad: boolean) {
    if (firstLoad) {
        loadHelpButton();
        return;
    }

    updateHelpState()

}

function loadHelpButton() {
    const switchButton = document.getElementById('switch');
    let switchInput = document.querySelector('#switch input');

    if (!switchButton || !(switchInput instanceof HTMLInputElement))
        return;

    //listner
    switchInput.addEventListener('change', (event: Event) => updateHelpState());

    //activate if in local storage/ check if there is a task with this eobotID
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key != 'help' + robotID)
            continue;

        switchInput.checked = true;
        updateHelpState()
    }
}

function hideHelpSection() {
    console.log(`Undisplay Help Button for Group for ${robotID}`);

    const helpList = document.getElementById('HelpList');
    if (helpList && helpAmount) {
        helpList.innerHTML = '';
        helpAmount.innerHTML = '';
        localStorage.removeItem('help' + robotID);
    }

}

function showHelpSection() {
    const maxHelp = groupInfo.players.length
    const numberOfHelp = groupInfo.players.filter(p => p.helpRequested).length
    localStorage.setItem('help' + robotID, "on");

    if (!helpAmount) {
        console.log("helpAmount not found")
        return
    }

    helpAmount.innerHTML = `${numberOfHelp} / ${maxHelp} players need help`;

    updateContent();
}

function updateHelpState() {
    let switchInput = document.querySelector('#switch input');

    if (!(switchInput instanceof HTMLInputElement))
        return;

    if (switchInput.checked)
        showHelpSection();
    else
        hideHelpSection();
}
//#endregion

updateGroupInfo(true);
