import { fetchGroupInfo, getQueryParam, GroupInfo, setGroupTasks, setHelpEnabled } from './API';
import { updateHelpEntries } from './IndividualGroup_HelpEntries';
import { LocalizationManager } from './Localization';
import { relativeURLWithPort } from "./API";
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
    helpEnabled: false,
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
    updateUserSettings();
}

function updateGroupInformation() {
    if (!pageHeader || !userNames) {
        console.error('Element with ID "pageHeader" not found or Robot ID not found in query parameters.');
        return;
    }

    pageHeader.innerHTML = groupInfo.robotID;

    if (groupInfo.players.length == 0) {
        userNames.innerHTML = "No players are here";
        LocalizationManager.setLocalisationKey(userNames, "noPlayers");
    }
    else {
        const groupMembers = groupInfo.players.map(p => p.name).join(", ");
        userNames.innerHTML = groupMembers;
        LocalizationManager.removeLocalisationKey(userNames);
    }
}

//User cards
function updateUserSettings(){
    var userComponents: Node[] = [];
    var cardsCollections: Node[] = [];
    
    const contentDiv = document.getElementById('UserList');
    if (!contentDiv) {
        console.error('Element with ID "UserList" not found.');
        return;
    }

    const TextHolder = document.createElement("div");
    TextHolder.className="textHolder";

    //getString
    const text1 = document.createElement("p"); 
    text1.textContent="Upon selecting desired user a new window will get open, where you can control the user controls";
    LocalizationManager.setLocalisationKey(text1,"changeUserSettingsDescription")
    //Individual user settings (Generate based on how many users are in session)
    const text2 = document.createElement("h4");
    text2.textContent="Change individual user settings: "
    LocalizationManager.setLocalisationKey(text2,"changeUserSettingsHeadline")

    TextHolder.replaceChildren(text2,text1);
    userComponents.push(TextHolder);

    const mainCardContainer = document.createElement("div");
    mainCardContainer.classList.add("mainContent", "wrapContainer");

    groupInfo.players.forEach(player => {
        const userHyperlink = document.createElement("a"); 
        userHyperlink.href =  relativeURLWithPort(`controller.html?robotID=${encodeURIComponent(groupInfo.robotID)}&overrideIndex=${encodeURIComponent(groupInfo.players.indexOf(player))}`, "8081", "http:")     
        userHyperlink.classList.add('card', "groupCard","userCard");

        const playerCard = document.createElement("div");
        userHyperlink.replaceChildren(playerCard);

        const memberHeadline = document.createElement("h4");
        memberHeadline.textContent=player.name;
        memberHeadline.style.textAlign="center";

        playerCard.replaceChildren(memberHeadline);
        cardsCollections.push(userHyperlink);
    });

    mainCardContainer.replaceChildren(...cardsCollections);
    userComponents.push(mainCardContainer);
    contentDiv.replaceChildren(...userComponents);
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
    LocalizationManager.setLocalisationKey(Headline, "taskList");
    taskCards.push(Headline);

    if (tasks.length == 0) {
        const subtitle = document.createElement("h3");
        subtitle.textContent = "There are no tasks set for this session";
        LocalizationManager.setLocalisationKey(subtitle, "noTasks");
        taskCards.push(subtitle);

        contentDiv.replaceChildren(...taskCards);
        return;
    }

    let taskLocalisationBank: Record<string, NonNullable<any>> = {};

    for (const task of groupInfo.tasks) {
        taskLocalisationBank[task.key] = task.strings;

        // Container that hold the checkbox and Text
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('taskDiv');

        const checkboxdiv = document.createElement('div');
        checkboxdiv.style.marginRight = '2%';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = task.key;
        checkbox.checked = task.completed;
        checkboxdiv.appendChild(checkbox);

        const taskText = document.createElement('p');
        taskText.textContent = task.strings["en"];
        LocalizationManager.setLocalisationKey(taskText, task.key);


        taskDiv.replaceChildren(checkbox, taskText);
        taskCards.push(taskDiv);

        checkbox.addEventListener('change', onCheckboxStateChanged);
    }
    contentDiv.replaceChildren(...taskCards);
    LocalizationManager.addNamedBanks({ BankName: "tasks", Bank: taskLocalisationBank });
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
    if (groupInfo.robotID.endsWith(")")) {
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

        LocalizationManager.setLocalisationKey(helpAmount, "needsHelp", {
            numberOfHelpRequests: numberOfHelp,
            maxPlayers: maxHelp
        });

        if (forceUpdate || (groupInfo.helpEnabled != lastGroupInfo.helpEnabled))
            updateHelpEntries();

    }
    else {
        helpList.innerHTML = '';
        helpAmount.innerHTML = '';
        LocalizationManager.removeLocalisationKey(helpAmount);

        for (const p of groupInfo.players)
            p.HelpRequested = false;
    }
}
//#endregion
await LocalizationManager.loadLocalisationBanks("/strings/common.json",
    "/strings/individualGroups.json");
loadHelpEnabledbutton();
await updateGroupInfo();

setInterval(updateGroupInfo, 5000);