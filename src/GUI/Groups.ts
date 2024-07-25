// Generate dynamically group panels in the GroupsPage.html
import { fetchGroups } from './api';

async function updateGroups() {
    console.log("I'm in functions");
    const contentDiv = document.getElementById('creatingGroupPanels');

    if (contentDiv) {
        const users: { robotID: string; names: string[] }[] = await fetchGroups(); // Fetch user data
        if (users.length === 0) {
            console.error('No users found or error fetching users.');
            return;
        }

        var newChildren : Node[] = []

        // Loop through all the groups 0 - n
        users.forEach((user) => {
            const groupCard = document.createElement('a');
            groupCard.classList.add('card', "groupCard");
            groupCard.id = user.robotID;
            groupCard.href = `IndividualGroup.html?robotID=${encodeURIComponent(user.robotID)}`;


            const robotNameTag = document.createElement('h1');
            robotNameTag.innerHTML = user.robotID; 

            const usersList = document.createElement('p');
            usersList.innerHTML = user.names.join('<br>');

            groupCard.appendChild(robotNameTag);
            groupCard.appendChild(usersList);

            newChildren.push(groupCard);
        });

        contentDiv.replaceChildren(...newChildren);
    } else {
        console.error('Element with ID "creatingGroupPanels" not found.');
    }
}

updateGroups();
setInterval(updateGroups, 5000);

