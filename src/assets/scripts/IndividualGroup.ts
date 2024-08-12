import { fetchGroupInfo, getQueryParam, GroupInfo, setGroupTasks, setHelpEnabled } from './API';
import { updateHelpEntries } from './IndividualGroup_HelpEntries';
const robotID = getQueryParam('robotID');
const pageHeader = document.getElementById('pageHeader');
const userNames = document.getElementById('userNameText');
const helpAmount = document.getElementById("helpText");
const helpList = document.getElementById('HelpList');

var lastGroupInfo: GroupInfo;
var groupInfo: GroupInfo = {
    robotID: "null",
    players: [],
    tasks: [],
    helpEnabled: false
};

async function getGroupInfo() {
    return await fetchGroupInfo(robotID ?? "null");
}


async function updateGroupInfo() {
    lastGroupInfo = groupInfo;
    groupInfo = await getGroupInfo();
    updateGroupInformation();
    updateTasks();
    updateHelpState();
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
        const groupMembers = groupInfo.players.map(p => p.name).join(", ");
        userNames.innerHTML = groupMembers;
    }
}

//#region tasks
export async function updateTasks() {
    let tasks = groupInfo.tasks;

    // add the loop
    const contentDiv = document.getElementById('TaskList');

    if (!contentDiv) {
        console.error('Element with ID "TaskList" not found.');
        return;
    }

    var taskCards: Node[] = [];

    const Headline = document.createElement('h2'); //Create the headline for the container 
    Headline.textContent = "Task List";
    taskCards.push(Headline);

    if (tasks.length == 0) {
        const subtitle = document.createElement("h3");
        subtitle.textContent = "There are no tasks set for this session";
        taskCards.push(subtitle);
    }

    tasks.forEach(task => {
        // Container that hold the checkbox and Text
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('taskDiv');

        const checkboxdiv = document.createElement('div');
        checkboxdiv.style.marginRight = '2%';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = task.Title;
        checkbox.checked = task.Value;
        checkboxdiv.appendChild(checkbox);

        const taskText = document.createElement('p');
        taskText.textContent = task.Title;

        taskDiv.replaceChildren(checkbox, taskText);
        taskCards.push(taskDiv);

        checkbox.addEventListener('change', onCheckboxStateChanged);
    });

    contentDiv.replaceChildren(...taskCards);
}

function onCheckboxStateChanged(event: Event) {
    var target = event.target as HTMLInputElement;

    setGroupTasks(robotID ?? "null", target.id, target.checked);
}

//#endregion

//#region help

function loadHelpEnabledbutton() {
    let switchInput = document.querySelector('#switch input');

    if (!(switchInput instanceof HTMLInputElement))
        return;

    //listner
    switchInput.addEventListener('change', onSwitchClicked);
}

async function onSwitchClicked(e: Event) {
    if (groupInfo.robotID.endsWith("(Not active)")) {
        (e.target as HTMLInputElement).checked = false;
        return;
    }
    groupInfo.helpEnabled = (e.target as HTMLInputElement).checked;

    setHelpEnabled(robotID ?? "null", groupInfo.helpEnabled);
    updateHelpState(true);
}

function updateHelpState(forceUpdate = false) {
    {
        let switchInput = document.querySelector('#switch input');

        if (switchInput instanceof HTMLInputElement)
            switchInput.checked = groupInfo.helpEnabled;
    }

    if (!helpList || !helpAmount)
        return;


    if (groupInfo.helpEnabled) {
        // Update help count
        const maxHelp = groupInfo.players.length;
        const numberOfHelp = groupInfo.players.filter(p => p.HelpRequested).length;
        helpAmount.innerHTML = `${numberOfHelp} / ${maxHelp} players need help`;

        if (forceUpdate || (groupInfo.helpEnabled != lastGroupInfo.helpEnabled))
            updateHelpEntries();

    }
    else {
        helpList.innerHTML = '';
        helpAmount.innerHTML = '';

        for (const p of groupInfo.players)
            p.HelpRequested = false;
    }
}
//#endregion

loadHelpEnabledbutton();
updateGroupInfo();
setInterval(updateGroupInfo, 5000);