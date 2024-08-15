// Generate dynamically group panels in the GroupsPage.html
import { fetchGroups, type GroupSummary } from './API';
import { LocalizationManager } from "./Localization";

var groups: GroupSummary[] = [];
var searchBarContent: string = "";

async function init() {
    const searchBar = document.getElementById("groupsSearch");
    searchBar?.addEventListener("input", updateSearch);

    refreshGroupData();
}

async function refreshGroupData() {
    groups = (await fetchGroups()).sort((lhs, rhs) => rhs.HelpNumber - lhs.HelpNumber); // Fetch user data
    updateGroupsDisplay();
}

async function updateSearch(event: Event) {
    const target = event.target as HTMLInputElement;

    searchBarContent = target.value;
    updateGroupsDisplay();
}

function filterGroups() {
    return groups.filter(
        g =>
            g.robotID.matchFuzzy(searchBarContent)
            || g.names.some(n => n.matchFuzzy(searchBarContent))
    );
}

async function updateGroupsDisplay() {
    const contentDiv = document.getElementById('creatingGroupPanels');

    if (!contentDiv)
        return;



    if (groups.length === 0) {
        const text = document.createElement("h2");
        text.innerText = "No groups are active at this moment.";
        LocalizationManager.setLocalisationKey(text, "noGroups");

        contentDiv.replaceChildren(text);
        return;
    }

    const filteredGroups = filterGroups();

    var newChildren: Node[] = [];

    // Loop through all the groups 0 - n
    filteredGroups.forEach(group => {
        const groupCard = document.createElement('a');
        groupCard.classList.add('card', "groupCard");
        groupCard.id = group.robotID;
        groupCard.href = `IndividualGroup.html?robotID=${encodeURIComponent(group.robotID)}`;

        if (group.HelpNumber > 0) {
            const voteSeverity = group.HelpNumber / group.names.length;
            const robotVoteBubble = document.createElement('div');
            robotVoteBubble.className = "voteBubble";

            const color = `hsl(0, 100%, 50%,  ${Math.pow(voteSeverity, 2)})`;
            robotVoteBubble.style.backgroundColor = color;

            const robotVoteNumber = document.createElement("span");

            robotVoteNumber.className = "voteBubbleNumber";
            robotVoteNumber.textContent = `${group.HelpNumber} / ${group.names.length}`;

            robotVoteBubble.appendChild(robotVoteNumber);

            groupCard.appendChild(robotVoteBubble);
        }

        const spacer1 = document.createElement('div');
        spacer1.className = "spacer";

        const robotNameTag = document.createElement('h1');
        robotNameTag.innerHTML = group.robotID;

        const usersList = document.createElement('p');

        const spacer2 = document.createElement('div');
        spacer2.className = "spacer";

        if (group.names.length == 0) {
            usersList.innerHTML = "There are no players";
            LocalizationManager.setLocalisationKey(usersList, "noPlayers");
        }
        else {
            LocalizationManager.removeLocalisationKey(usersList);
            usersList.innerHTML = group.names.join('<br/>');
        }


        groupCard.appendChild(spacer1);
        groupCard.appendChild(robotNameTag);
        groupCard.appendChild(usersList);
        groupCard.appendChild(spacer2);

        newChildren.push(groupCard);
    });

    contentDiv.replaceChildren(...newChildren);
}



// Simple fuzzy search implementation by Trevor Dixon
// Source: https://stackoverflow.com/a/16908326
function matchFuzzy(this: string, search: string) {
    search = search.toUpperCase();
    const text = this.toUpperCase();

    var j = -1; // remembers position of last found character

    // consider each search character one at a time
    for (var i = 0; i < search.length; i++) {
        var l = search[i];
        if (l == ' ') continue;     // ignore spaces

        j = text.indexOf(l, j + 1);     // search for character & update position
        if (j == -1) return false;  // if it's not found, exclude this item
    }
    return true;
}

// Declare the Extension
declare global {
    interface String {
        matchFuzzy(search: string): boolean;
    }
}
String.prototype.matchFuzzy = matchFuzzy;

await LocalizationManager.loadLocalisationBanks("/strings/common.json",
    "/strings/groups.json"
);

await init();
setInterval(refreshGroupData, 5000);

