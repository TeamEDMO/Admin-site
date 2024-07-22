//Import tasks from txt file to the html div object in IndividualGroup.hmtl
    import { getQueryParam } from './api';
    let globalRobotID = getQueryParam('robotID');
    let tasksCollection:String[]= [];
    export function updateContent() {
        //At the beginning get content from local storage
        fetch('assets/help.txt') 
            .then(response => response.text())
            .then(text => {
                const lines = text.split('\n');
                const contentDiv = document.getElementById('HelpList');
                if (contentDiv) {
                   
                    contentDiv.innerHTML = '';

                    //add predefined tasks that cannot be deleted 
                    addPredefinedHelp(contentDiv,lines);
                  
                    //here add new tasks
                    const containerPersonalizedTasks = document.createElement('div');
                    containerPersonalizedTasks.id='tasksContainerP';
                    contentDiv.appendChild(containerPersonalizedTasks);
                    loadTasksFromLocalStorage(containerPersonalizedTasks);

                    createTextArea(contentDiv); //TextArea + add button
                    const spacer = document.createElement('div');
                    spacer.style.padding='2%';
                    spacer.style.borderRadius='17px';
                    contentDiv.appendChild(spacer);
                    
                } else {
                    console.error('Element with ID "TaskList" not found.');
                }
            })
            .catch(error => console.error('Error loading text file:', error));
    }

    function createPersonalizedHelpContainer(textContent: string, fromLocalData: boolean): HTMLElement{
        const div = document.createElement('div');
        div.classList.add("helpArea");
        div.id=textContent;
        
        const text = document.createElement('button');
        text.textContent=textContent;
        text.id=textContent;
        text.classList.add('helpButton');
        buttonOnClick(text);

        const iconContainer = document.createElement('div');
        iconContainer.style.alignContent='center';
        iconContainer.style.cursor='pointer';

        const minusIcon = document.createElement('i');
        minusIcon.className='fa-solid fa-minus minusIcon';

        const spacer2 = document.createElement('div');
        spacer2.style.width='5%';

        deleteHelpOption(iconContainer);
        iconContainer.appendChild(minusIcon);
        div.appendChild(text);
        div.appendChild(iconContainer);
        div.appendChild(spacer2);
        //div.appendChild(text);
        if(!fromLocalData){
            console.log("i want to push: "+ textContent);
            tasksCollection.push(textContent);
            saveTasksToLocalStorage(tasksCollection);
        }
        return div;
    }
    //Retrieve the current EDMO ID that is on this page 
   
    function deleteHelpOption(deleteButton: HTMLElement){
        deleteButton.addEventListener('click', () => {
            //Find which children of the container was clicked and dispose of that kid
            const parentContainerOfTheButton = deleteButton.parentElement; 
            const someElement = document.getElementById('tasksContainerP');
            if(someElement){
                const children = someElement.children;
                for (let i = 0; i < children.length; i++) {
                    const childElement = children[i] as HTMLElement; // Cast to HTMLElement
                    console.log(childElement.textContent);
                    if(childElement==parentContainerOfTheButton){
                        someElement.removeChild(childElement);
                        deleteTaskFromLocalStorage(parentContainerOfTheButton.id);
                    }
                }
            }else {console.log("it is null")}
        });
    }
    function createTextArea(container:HTMLElement){
        const div = document.createElement('div');
        div.classList.add('helpInputContainer');
        
        let spacer = document.createElement('div');
        spacer.style.flexGrow='1';
        let spacer2= spacer.cloneNode(true);

        const textArea = document.createElement('textarea');
        textArea.id='TeacherHelpInput';
        textArea.rows=4;
        textArea.placeholder="type personalized help here...";
 
    
        const sendButton = document.createElement('button');
        sendButton.textContent='Add';

        addSendButtonListener(sendButton,textArea);

        const gap = document.createElement('div');
        gap.style.padding="1%";

        div.appendChild(spacer);
        div.appendChild(textArea);
        div.appendChild(gap);
        div.appendChild(sendButton);
        div.appendChild(spacer2);
        container.appendChild(div);
    }
    function addPredefinedHelp(contentDiv: HTMLElement, lines: String[]){
        lines.forEach(line => {
            const div = document.createElement('div');
            div.classList.add('helpInputContainer');

            const helpText = document.createElement('button');
            helpText.textContent = line.trim();
            helpText.id = line.trim();
            helpText.classList.add('helpButton');
            buttonOnClick(helpText);

            div.appendChild(helpText);
            contentDiv.appendChild(div);
        });
    }
    function addSendButtonListener(button: HTMLButtonElement, textArea: HTMLTextAreaElement) {
        button.addEventListener('click', () => {
            const someElement = document.getElementById('tasksContainerP');
            if(someElement){
                someElement.appendChild(createPersonalizedHelpContainer(textArea.value,false));
                console.log(textArea.value);
                textArea.value = '';
            }else {console.log("it is null")}
        });
    }
    function saveTasksToLocalStorage(tasks:String[]) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    function loadTasksFromLocalStorage(container: HTMLElement) {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            // Parse the JSON string into a JavaScript array
            const parsedTasks = JSON.parse(storedTasks);
            tasksCollection = parsedTasks;
            console.log("after loading: "+tasksCollection);
            //initialize tasks stored in local storage
            parsedTasks.forEach((task: string) => {
               let taskElement =createPersonalizedHelpContainer(task,true);
               container.appendChild(taskElement);
            })

        }
    }
    function deleteTaskFromLocalStorage(taskToDelete: string){
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            // Parse the JSON string into a JavaScript array
            const parsedTasks = JSON.parse(storedTasks);
            parsedTasks.forEach((task: string) => {
                if(task==taskToDelete){
                    console.log("should delete from storage");
                    const indexToRemove = tasksCollection.indexOf(task);
                    tasksCollection.splice(indexToRemove, 1);
                    localStorage.setItem('tasks', JSON.stringify(tasksCollection));
                }
            })
        }
    }
    function buttonOnClick(helpButton: HTMLButtonElement){
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
        console.log(`button with ID ${helpId} is was sent for Edmo Group: ${globalRobotID}` );
        //TODO: SEND INFOMRATION WHICH HELP WAS SENT 
    }


