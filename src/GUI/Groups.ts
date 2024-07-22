// Generate dynamically group panels in the GroupsPage.html
import { fetchUserData } from './api';
async function updateContentWrap() {
        console.log("I'm in functions");
        let evenGroupCount = 0;
        const contentDiv = document.getElementById('creatingGroupPanels'); // Scrollable panel
        if (contentDiv) {
    
            contentDiv.classList.add("wrapContainer");
            contentDiv.innerHTML = ''; // Clear previous content
            
            const users: { robotID: string; names: string[] }[] = await fetchUserData(); // Fetch user data
            if (users.length === 0) {
                console.error('No users found or error fetching users.');
                return;
            }

            // Loop through all the groups 0 - n
            users.forEach((user: { robotID: string; names: string[] }) => {
// set wrap flex and set row 
                // Actual group panels
                const groupLink = document.createElement('a');
                groupLink.classList.add('groupLink');
                groupLink.href = `IndividualGroup.html?robotID=${encodeURIComponent(user.robotID)}`; // ; // TODO: Setting HTML page link for each of the groups
                

                const groupPanel = document.createElement('div'); // Row panel that holds up to two groups
                groupPanel.id = user.robotID;
                groupPanel.classList.add('groupCard');
            
                const robotID = document.createElement('h1');
                robotID.classList.add('robotIDHeader');
                robotID.innerHTML = user.robotID; //TODO: (Retrieve ID From Server) Use innerHTML to support line breaks

                const p = document.createElement('p');
                p.innerHTML = user.names.join('<br>');//TODO: (Retrieved info from server) Use innerHTML to support line breaks
                p.classList.add('text');

                groupPanel.appendChild(robotID);
                groupPanel.appendChild(p);
                groupLink.appendChild(groupPanel);

                // Append the group link to the current div
                contentDiv.appendChild(groupLink);

                evenGroupCount++;
            });
        } else {
            console.error('Element with ID "creatingGroupPanels" not found.');
        }
    }


//updateContent();
updateContentWrap();
//setInterval(updateContentWrap, 5000);
//set method to update names of the groups 

