import { sources } from 'webpack';
import { getQueryParam } from './api'; 
import { fetchGroups } from './api'; 
import { updateContent } from './ImportHelpOptions'; 
import {createTasks} from './ImportTasks'; 
const robotID = getQueryParam('robotID');
const pageHeader = document.getElementById('pageHeader');
const userNames = document.getElementById('userNameText');
const helpAmount = document.getElementById("helpText");
let intervalID: NodeJS.Timeout;

async function getUserByRobotID(robotID: string) {
    const users: { robotID: string; names: string[] }[] = await fetchGroups(); // Assuming fetchUserData() returns the users array
    const user = users.find(user => user.robotID.toLowerCase() === robotID.toLowerCase());
    return user;
}
function displayGroupInformation(){
    if (pageHeader && robotID && userNames) {
        getUserByRobotID(robotID).then(user => {
            if (user) {
                pageHeader.innerHTML = user.robotID;
                userNames.innerHTML = `${user.names.join(', ')}`;
            } else {
                console.error('User not found for robotID:', robotID);
            }
        }).catch(error => {
            console.error('Error fetching user data:', error);
        });
    } else {
        console.error('Element with ID "pageHeader" not found or Robot ID not found in query parameters.');
    };
}

function activateHelpButton(){
    const switchButton = document.getElementById('switch');
    let switchInput = document.querySelector('#switch input');
    if(switchButton && switchInput instanceof HTMLInputElement){
        //activate if in local storage/ check if there is a task with this eobotID
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if(key=='help'+robotID){
                switchInput.checked=true;
                updateContent();
                //intervalID =setInterval(updateContent,5000);
                console.log("SWITHC PLS ON");
            }
        }
        //listner
        switchButton.addEventListener('change', (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (target.checked && helpAmount) {
                console.log(`Display Help Button for Group for ${robotID}`);
                updateContent();
                //intervalID =setInterval(updateContent,5000);
                // TODO: update dynamically the number of people that needs help (amount of users on right and voted yes on left)
                helpAmount.innerHTML="0"+"/" +"4";
                localStorage.setItem('help'+robotID, JSON.stringify("on"));
            } else {
                console.log(`Undisplay Help Button for Group for ${robotID}`);
                const contentDiv = document.getElementById('HelpList');
                if (contentDiv && helpAmount) {
                    contentDiv.innerHTML = '';
                    helpAmount.innerHTML= '';
                    //clearInterval(intervalID);
                    localStorage.removeItem('help'+robotID);
                }
            }
        });
    }
}

displayGroupInformation();
createTasks();
activateHelpButton();