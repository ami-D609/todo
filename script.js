
/* DOMContentLoaded Event: Waits until all HTML is loaded before running JavaScript */
document.addEventListener('DOMContentLoaded', () => {
    /* Get references to HTML elements by their IDs */
    const todoInput = document.getElementById('todo-input');      // Text input field
    const reminderInput = document.getElementById('reminder-input'); // Reminder datetime input
    const addBtn = document.getElementById('add-btn');            // Add button
    const todoList = document.getElementById('todo-list');        // Todo list container
    const darkModeBtn = document.getElementById('dark-mode-btn'); // Dark mode toggle button
    const menuBtn = document.getElementById('menu-btn');          // Hamburger menu button
    const todoPage = document.getElementById('todo-page');        // Todo page section
    const aboutPage = document.getElementById('about-page');      // About us section
    const infoBtn = document.getElementById('info-btn');
    const infoPage = document.getElementById('info-page');
    const returnBtn = document.getElementById('return-btn');
    
    setInterval(updateClock,1000);
    /* Load saved todos on page load */
    loadTodos();
    
    /* Functions for persisting todos in localStorage */
    function saveTodos() {
        const todos = [];
        document.querySelectorAll('.todo-item').forEach(li => {
            const span = li.querySelector('.todo-text');
            const reminder = li.dataset.reminder || null;
            todos.push({ text: span.textContent, reminder: reminder });
        });
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function loadTodos() {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            const todos = JSON.parse(savedTodos);
            todos.forEach(todo => {
                addTodoFromStorage(todo.text, todo.reminder);
            });
        }
    }

    /* Helper function to add todo from storage without clearing input */
    function addTodoFromStorage(todoText, reminderTime) {
        /* Create a new list item (LI) element */
        const l = document.createElement('li');
        l.className = 'todo-item';
        if (reminderTime) {
            l.dataset.reminder = reminderTime;
        }

        /* Create a SPAN element to display the todo text */
        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = todoText;

        /* Create a delete button for removing the todo */
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        
        /* Add click event to delete button to remove the todo item and save */
        deleteBtn.addEventListener('click', () => {
            todoList.removeChild(l);
            saveTodos();
        });

        /* Add the text span and delete button to the list item */
        l.appendChild(span);
        l.appendChild(deleteBtn);
        
        /* Add the completed list item to the todo list */
        todoList.appendChild(l);

        /* Schedule reminder if set */
        if (reminderTime) {
            scheduleReminder(todoText, reminderTime);
        }
    }

    /* Create a lightweight click sound using the Web Audio API */
    const click = new (window.AudioContext || window.webkitAudioContext)();
    function playClickSound(frequency = 520,dur=0.05) {
        if (typeof frequency !== 'number') {
            frequency = 520;
        }
        if(typeof dur!=='number')
{ dur=0.05;}
            const oscillator = click.createOscillator();
        const gain = click.createGain();
        oscillator.type = 'triangle';
        oscillator.frequency.value = frequency;
        if (frequency < 500) {
            gain.gain.value = 0.5;
        }
        else{gain.gain.value=0.08;}
        oscillator.connect(gain);
        gain.connect(click.destination);
        oscillator.start();
        oscillator.stop(click.currentTime +dur);
    }
    /* Play sound on any button click in the app */
    document.querySelectorAll('button').forEach(button => {
     const i = button===addBtn?1000:220;
        button.addEventListener('click', () => playClickSound(i,0.05));
    });
    /* Click event listener: Runs addTodo function when button is clicked */
    addBtn.addEventListener('click', addTodo);
    
    /* Keypress event listener: Runs addTodo function when Enter key is pressed in input field */
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
 function showpage(showpage)
 { todoPage.classList.add('hidden');
  aboutPage.classList.add('hidden');
  infoPage.classList.add('hidden');
  showpage.classList.remove('hidden');
 }
    /* Page toggle button:
       - Shows the About Us page and hides the todo page when clicked.
       - Uses CSS helper class 'hidden' to hide content sections.
       - Clicking again switches back to the todo page.
       - This keeps the page markup in place and only changes visibility. */
    menuBtn.addEventListener('click', () => {
      if(aboutPage.classList.contains('hidden')&&infoPage.classList.contains('hidden'))
        {showpage(aboutPage);}
      else if(!aboutPage.classList.contains('hidden')&&infoPage.classList.contains('hidden'))
      {showpage(todoPage);}
     });
    returnBtn.addEventListener('click',()=>
    {showpage(aboutPage);})
    infoBtn.addEventListener('click', () => {
      showpage(infoPage);
    });

    /* Dark mode toggle event listener:
       - This listener waits for a click on the dark mode button.
       - document.body.classList.toggle('dark-mode') is the technical action.
         * It adds the CSS class 'dark-mode' to <body> if it is missing.
         * It removes the class if it is already present.
       - When the class is present, CSS rules for dark mode apply.
         Those rules are defined in styles.css and change colors, background,
         and button appearance without changing the HTML structure.
       - The next line updates the button icon so the UI reflects the current mode.
         * darkModeBtn.textContent = '☀️' when dark mode is active.
         * darkModeBtn.textContent = '🌙' when light mode is active.

       Terms used in this section:
         * event listener: code that runs in response to a user action.
         * click: the mouse or touch press event that triggers the listener.
         * CSS class: a named style group that can be applied to elements.
         * toggle: switch on/off depending on current state.
         * body: the top-level HTML element containing page content.
         * textContent: the text shown inside an element.

       Variations for implementing the same idea:
         1. Use a data attribute instead of a class, e.g. document.body.dataset.theme = 'dark'.
         2. Store the mode in localStorage so it persists after page reloads.
         3. Use the prefers-color-scheme CSS media query for automatic default mode.
         4. Toggle a class on a container element inside body instead of body itself.
         5. Use CSS custom properties (variables) and change their values in JS.

       Different approaches:
         * CSS-only approach: use a checkbox or input and :checked styles to switch themes.
         * JavaScript + class approach: easiest and most common for dynamic theme toggles.
         * JavaScript + CSS variables: change colors by applying different variable sets.
         * Persistent theme approach: save mode in localStorage or cookies and restore on load.
         * System preference approach: combine JS toggle with prefers-color-scheme for default mode. */
    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        darkModeBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });
  
    /* Function to add a new todo item to the list */
    function addTodo() {
        /* Get the input value and remove extra spaces */
        const todoText = todoInput.value.trim();
        const reminderTime = reminderInput.value;
        
        /* Exit if input is empty */
        if (todoText === '') return;

        /* Create a new list item (LI) element */
        const l = document.createElement('li');
        l.className = 'todo-item';
        if (reminderTime) {
            l.dataset.reminder = reminderTime;
        }

        /* Create a SPAN element to display the todo text */
        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = todoText;

        /* Create a delete button for removing the todo */
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        
        /* Add click event to delete button to remove the todo item */
        deleteBtn.addEventListener('click', () => {
            playClickSound(1500,0.05);
            todoList.removeChild(l);
            saveTodos();
        });

        /* Add the text span and delete button to the list item */
        l.appendChild(span);
        l.appendChild(deleteBtn);
        
        /* Add the completed list item to the todo list */
        todoList.appendChild(l);

        /* Save todos after adding */
        saveTodos();

        /* Schedule reminder if set */
        if (reminderTime) {
            scheduleReminder(todoText, reminderTime);
        }

        /* Clear the input fields for the next todo */
        todoInput.value = '';
        reminderInput.value = '';
    }

   function scheduleReminder(todoText, reminderTime)
   { const now=new Date();
     const reminder=new Date(reminderInput.value);
     const timer=reminder-now;
     if(timer>0)
   {
    setTimeout(()=>{
        
        alert(`Reminder:${todoText}`);
      playClickSound(5000,1);
      playClickSound(500,1);
          playClickSound(1000,0.5);
      playClickSound(300,0.05);
        todoList.removeChild(document.querySelector(`.todo-item`));
        saveTodos();}
,timer)
   }}

function updateClock()
{ const now = new Date();
    const timeString =now.toLocaleTimeString();
    document.getElementById('clock').textContent=timeString
}
});