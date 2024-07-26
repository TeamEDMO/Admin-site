import { fetchGroupInfo, getQueryParam, GroupInfo } from './api';
import { updateHelpEntries } from './IndividualGroup_HelpEntries';
const robotID = getQueryParam('robotID');
const pageHeader = document.getElementById('pageHeader');
const userNames = document.getElementById('userNameText');
const helpAmount = document.getElementById("helpText");

var groupInfo: GroupInfo;

async function getGroupInfo() {
    return await fetchGroupInfo(robotID ?? "null");
}

async function loadContent() {
    groupInfo = await getGroupInfo();

    updateGroupInformation();
    await createTasks();
    await loadHelpButton();
}

async function updateGroupInfo() {
    groupInfo = await getGroupInfo();
    updateGroupInformation();
    updateHelpCount();
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
    let tasks = (await (await fetch('assets/tasks.txt')).text()).split('\n').map(s => s.trim());

    // add the loop
    const contentDiv = document.getElementById('TaskList');

    var taskCards: Node[] = [];

    if (!contentDiv) {
        console.error('Element with ID "TaskList" not found.');
        return;
    }

    loadCompletedTasks();

    var taskCards: Node[] = [];

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
        checkbox.checked = tasksCollection.includes(task);
        checkboxdiv.appendChild(checkbox);

        const taskText = document.createElement('p');
        taskText.textContent = task;

        taskDiv.replaceChildren(checkbox, taskText);
        taskCards.push(taskDiv);

        checkbox.addEventListener('change', onCheckboxStateChanged);
    });

    contentDiv.replaceChildren(...taskCards);
}

function onCheckboxStateChanged(event: Event) {
    var target = event.target as HTMLInputElement;

    if (target.checked) {
        console.log(`Checkbox for ${target.value} is checked`);
        tasksCollection.push(target.id);
    } else {
        console.log(`Checkbox for ${target.value} is unchecked`);
        //delete from local storage
        tasksCollection = tasksCollection.filter(t => t != target.id);
    }
    updateCompletedTaskStorage();
    handleCheckboxChange(target.id, target.checked);
}


function handleCheckboxChange(taskId: string, isChecked: boolean) {
    //TODO: Stuff
    console.log(`Checkbox with ID ${taskId} is now ${isChecked ? 'checked' : 'unchecked'} for Edmo Group: ${robotID}`);
}
function updateCompletedTaskStorage() {
    let name = 'taskComplete' + robotID;
    localStorage.setItem(name, JSON.stringify(tasksCollection));
}

function loadCompletedTasks() {
    let name = 'taskComplete' + robotID;
    const storedTasks = localStorage.getItem(name);

    if (!storedTasks)
        return;

    tasksCollection = JSON.parse(storedTasks);
    const concatenatedString = tasksCollection.join(',');
    console.log(concatenatedString);
}

//#endregion

//#region help

function loadHelpButton() {
    let switchInput = document.querySelector('#switch input');

    if (!(switchInput instanceof HTMLInputElement))
        return;

    //listner
    switchInput.addEventListener('change', (event: Event) => updateHelpState());

    //activate if in local storage/ check if there is a task with this eobotID
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key != 'help' + robotID)
            continue;

        switchInput.checked = true;
        showHelpSection();
        break;
    }
}

function hideHelpSection() {
    console.log(`Undisplay Help Button for Group for ${robotID}`);

    const helpList = document.getElementById('HelpList');
    localStorage.removeItem('help' + robotID);

    if (!helpList || !helpAmount)
        return;

    helpList.innerHTML = '';
    helpAmount.innerHTML = '';
}

function showHelpSection() {

    localStorage.setItem('help' + robotID, "on");

    updateHelpCount();
    updateHelpEntries();
}

function updateHelpCount() {
    let switchInput = document.querySelector('#switch input');

    if (!(switchInput instanceof HTMLInputElement))
        return;

    if (!helpAmount) {
        console.log("helpAmount not found");
        return;
    }

    if (switchInput.checked) {
        const maxHelp = groupInfo.players.length;
        const numberOfHelp = groupInfo.players.filter(p => p.helpRequested).length;
        helpAmount.innerHTML = `${numberOfHelp} / ${maxHelp} players need help`;
    }
    else {
        helpAmount.innerHTML = "";
    }
}

function updateHelpState() {
    let switchInput = document.querySelector('#switch input');

    if (!(switchInput instanceof HTMLInputElement))
        return;

    switchInput.checked ? showHelpSection() : hideHelpSection();
}
//#endregion

loadContent();
setInterval(updateGroupInfo, 5000);