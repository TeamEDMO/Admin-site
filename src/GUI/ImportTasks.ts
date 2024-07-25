import { getQueryParam } from './api';
//Import tasks from txt file to the html div object in IndividualGroup.hmtl
let globalRobotID = getQueryParam('robotID');
let tasksCollection: String[]=[];
//Fix that so it does not use DOMContentLoaded set the interval
// change it so it add whole content at once and not seperatly 

export async function createTasks() {
    let tasks = await fetch('assets/tasks.txt')
    let text =  await tasks.text()
    
    // add the loop
            const lines = text.split('\n');
            const contentDiv = document.getElementById('TaskList');

            if (contentDiv) {
                loadTasksFromLocalStorage();
                contentDiv.innerHTML = ''; //Clear all content in the container 
                const Headline = document.createElement('h2'); //Create the headline for the container 
                Headline.textContent="Task List";
      
                contentDiv.appendChild(Headline);

                lines.forEach(line => {
                    // Container that hold the checkbox and Text
                    const taskDiv = document.createElement('div');
                    taskDiv.classList.add('taskDiv'); 
                    
                    const checkboxdiv= document.createElement('div');
                    checkboxdiv.style.margin='2%';

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = line.trim(); //Line as checkbox task ID + add EDMO ID?
                    markedCheckedBoxes(checkbox);

                    const taskText = document.createElement('p'); 
                    taskText.textContent = line.trim();
                    taskText.classList.add('text'); 
           
                    checkboxdiv.appendChild(checkbox);
                    taskDiv.appendChild(checkboxdiv);
                    taskDiv.appendChild(taskText);
                    contentDiv.appendChild(taskDiv);

                    checkbox.addEventListener('change', (event: Event) => {
                        const target = event.target as HTMLInputElement;
                        if (target.checked) {
                            console.log(`Checkbox for ${target.value} is checked`);
                            tasksCollection.push(line.trim());
                            saveTasksToLocalStorage(tasksCollection);
                        } else {
                            console.log(`Checkbox for ${target.value} is unchecked`);
                            //delete from local storage
                            deleteTaskFromLocalStorage(target.id);
                        }
        
                        // Handle the checkbox state change
                        handleCheckboxChange(target.id, target.checked);
                    });

                });
            } else {
                console.error('Element with ID "TaskList" not found.');
            }
        }
function markedCheckedBoxes(checkbox: HTMLInputElement){
    tasksCollection.forEach( task =>{
        if(checkbox.id==task){
            checkbox.checked=true;
        }
    });
}
function handleCheckboxChange(taskId: string, isChecked: boolean) {
    console.log(`Checkbox with ID ${taskId} is now ${isChecked ? 'checked' : 'unchecked'} for Edmo Group: ${globalRobotID}` );
}

function saveTasksToLocalStorage(tasks:String[]) {
    let name = 'taskComplete' + globalRobotID;
    localStorage.setItem(name, JSON.stringify(tasks));
}
function deleteTaskFromLocalStorage(taskToDelete: string){
    let name = 'taskComplete' + globalRobotID;
    const storedTasks = localStorage.getItem(name);
    if (storedTasks) {
        // Parse the JSON string into a JavaScript array
        const parsedTasks = JSON.parse(storedTasks);
        parsedTasks.forEach((task: string) => {
            if(task==taskToDelete){
                console.log("should delete from storage");
                const indexToRemove = tasksCollection.indexOf(task);
                tasksCollection.splice(indexToRemove, 1);
                localStorage.setItem(name, JSON.stringify(tasksCollection));
            }
        })
    }
}
function loadTasksFromLocalStorage() {
    let name = 'taskComplete' + globalRobotID;
    const storedTasks = localStorage.getItem(name);
    if (storedTasks) {
        tasksCollection = JSON.parse(storedTasks);
        const concatenatedString = tasksCollection.join(',');
        console.log(concatenatedString);
    }
}
