import { stat } from "node:fs";

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const addClientBtn = document.getElementById('add-client-btn');
    const cancelModalBtn = document.getElementById('close-client-modal');
    const addClientForm = document.getElementById('add-client-form');
    const addTaskBtn = document.getElementById('add-task-form');

    if(signupForm){
        signupForm.addEventListener('submit', handleFormSubmit);
    }
    if(loginForm){
        loginForm.addEventListener('submit', loginFormSubmit);
    }
    if(addClientBtn){
        addClientBtn.addEventListener('click', () => {
            document.getElementById('client-modal').style.display = 'block';
        });
    }
    if(cancelModalBtn){
        cancelModalBtn.addEventListener('click', () => {
            document.getElementById('client-modal').style.display = 'none';
        });
    }

    if(addClientForm){
        addClientForm.addEventListener('submit', clientFormSubmit);
    }

    if(addTaskBtn){
        addTaskBtn.addEventListener('submit', TaskFormSubmit);
    }

});

async function handleFormSubmit(event) {
    event.preventDefault();

    const data = {
        name: event.target.username.value,
        email: event.target.email.value,
        password: event.target.password.value,
    };

    try {
        axios.post('http://localhost:3000/api/users/signup', data)
            
        alert('Signup successful! Please log in.');
        window.location.href = '/login.html';
            
         
    } catch (error) {
        console.error('Error during signup:', error);
    }

}

async function loginFormSubmit(event) {
    event.preventDefault();

    const email = event.target.email.value.trim();
    const password = event.target.password.value.trim();

    try {
        const response = await axios.post('http://localhost:3000/api/users/sign-in', {
            email,
            password
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', response.data.user.name);
        
        alert('Login successful! ');
        window.location.href = '/DisplayClients.html';
    } catch (error) {
        displayError(error.response?.data?.message || 'Login failed');
        console.error('Error during login:', error);
    }
}

function displayError(message) {
    const errorDiv = document.getElementById('message');
    errorDiv.textContent = message;
}

function clientFormSubmit(event) {
    event.preventDefault();

    const data = {
        company: event.target['clientname-input'].value.trim(),
        country: event.target['client-country-input'].value.trim(),
        entity: event.target['client-entity-input'].value.trim(),
    };

    try {
        // const response = axios.post('http://localhost:3000/api/clients', data, {
        //     headers: {
        //         Authorization: `Bearer ${localStorage.getItem('token')}`,
        //     },
        // });
        const newClient = data.company;
        const clientList = document.getElementById('client-list');
        const newClientItem = document.createElement('button');
        newClientItem.textContent = newClient;
        newClientItem.classList.add('client-item');
        clientList.appendChild(newClientItem);
        document.getElementById('client-modal').style.display = 'none';
    } catch (error) {
        
    }

}

function TaskFormSubmit(event) {
    event.preventDefault();

    const data = {
        title: event.target['task-title-input'].value.trim(),
        description: event.target['task-desc-input'].value.trim(),
        category: event.target['task-category-input'].value.trim(),
        dueDate: event.target['task-due-date-input'].value.trim(),
        status: event.target['task-status-input'].value.trim(),
        priority: event.target['task-priority-input'].value.trim()
    };

    try {
        const response = axios.post('http://localhost:3000/api/tasks', data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const newTask = data.title;
        const newbutton = document.createElement('button');
        const taskList = document.getElementById('task-list');
        const newTaskItem = document.createElement('li');
        newTaskItem.textContent = newTask + ': ' + data.description;
        newTaskItem.classList.add('task-item');
        taskList.appendChild(newTaskItem);
        document.getElementById('task-modal').style.display = 'none';
    } catch (error) {
        
    }
}