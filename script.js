const state = {
    clients: [],
    tasks: [],
    selectedClient: null
};

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const addClientBtn = document.getElementById('add-client-btn');
    const cancelModalBtn = document.getElementById('close-client-modal');
    const addClientForm = document.getElementById('add-client-form');
    const addTaskBtn = document.getElementById('add-task-form');
    const logoutBtn = document.getElementById('logout-btn');
    const statusFilter = document.getElementById('status-filter');
    const categoryFilter = document.getElementById('category-filter');
    const currentUser = document.getElementById('current-user');
    const modal = document.getElementById('client-modal');

    if (document.getElementById('client-list')) {
        if (currentUser) {
            currentUser.textContent = localStorage.getItem('user') || 'User';
        }
        fetchClients();
    }

    if(signupForm){
        signupForm.addEventListener('submit', handleFormSubmit);
    }
    if(loginForm){
        loginForm.addEventListener('submit', loginFormSubmit);
    }
    addClientBtn?.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    cancelModalBtn?.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    if(addClientForm){
        addClientForm.addEventListener('submit', clientFormSubmit);
    }

    if(addTaskBtn){
        addTaskBtn.addEventListener('submit', TaskFormSubmit);
    }

    if(logoutBtn){
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login.html';
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            if (state.selectedClient) {
                fetchTasks(state.selectedClient.id);
            }
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('input', () => {
            renderTasks();
        });
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
        await axios.post('http://localhost:3000/api/users/signup', data)

        showMessage('Signup successful! Please log in.', 'success');
        window.location.href = '/login.html';
    } catch (error) {
        displayError(error.response?.data?.message || 'Signup failed');
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

        showMessage('Login successful!', 'success');
        window.location.href = '/DisplayClients.html';
    } catch (error) {
        displayError(error.response?.data?.message || 'Login failed');
        console.error('Error during login:', error);
    }
}

function displayError(message) {
    showMessage(message, 'error');
}

function showMessage(message, type = 'error') {
    const messageEl = document.getElementById('message');

    if (!messageEl) {
        return;
    }

    messageEl.textContent = message;
    messageEl.hidden = false;
    messageEl.className = document.getElementById('client-list')
        ? `toast ${type}`
        : `inline-message ${type}`;
}

async function clientFormSubmit(event) {
    event.preventDefault();

    const data = {
        company: event.target['clientname-input'].value.trim(),
        country: event.target['client-country-input'].value.trim(),
        entity: event.target['client-entity-input'].value.trim(),
    };

    try {
        const response = await axios.post('http://localhost:3000/api/clients', data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        await fetchClients();
        event.target.reset();
        document.getElementById('client-modal').hidden = true;
        showMessage('Client added successfully.', 'success');
    } catch (error) {
        displayError(error.response?.data?.message || 'Could not add client');
    }

}

async function TaskFormSubmit(event) {
    event.preventDefault();

    if (!state.selectedClient) {
        alert("Please select a client first");
        return;
    }

    const data = {
        title: event.target['task-title-input'].value.trim(),
        description: event.target['task-desc-input'].value.trim(),
        category: event.target['task-category-input'].value.trim(),
        dueDate: event.target['task-due-date-input'].value.trim(),
        status: event.target['task-status-input'].value.trim(),
        priority: event.target['task-priority-input'].value.trim(),
        clientId: state.selectedClient.id
    };

    try {
        await axios.post('http://localhost:3000/api/tasks', data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        event.target.reset();
        await fetchTasks(state.selectedClient.id);
        showMessage('Task saved.', 'success');

    } catch (error) {
        displayError(error.response?.data?.message || 'Could not save task');
        console.error(error);
    }
}

async function fetchClients() {
    try {
        const response = await axios.get('http://localhost:3000/api/clients/all', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const raw = response.data.clients;
        console.log('Raw clients data:', raw);

        state.clients = raw;

        renderClients();

    } catch (error) {
        console.error('Error fetching clients:', error);
        displayError('Could not load clients');
    }
}

function renderClients() {
    const clientList = document.getElementById('client-list');
    const emptyState = document.getElementById('client-empty-state');

    clientList.innerHTML = '';

    if (!state.clients.length) {
        emptyState.hidden = false;
        return;
    }

    emptyState.hidden = true;

    state.clients.forEach(client => {
        const btn = document.createElement('button');

        btn.textContent = client.companyName;
        btn.className = 'client-item';

        if (state.selectedClient?.id === client.id) {
            btn.classList.add('selected');
        }

        btn.addEventListener('click', () => {
            state.selectedClient = client;

            document.getElementById('selected-client-name').textContent = client.companyName;
            document.getElementById('selected-client-meta').textContent =
                `${client.country || ''} • ${client.entityType || ''}`;

            renderClients();    
            fetchTasks(client.id);     
        });

        clientList.appendChild(btn);
    });
}

function renderTasks() {
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('task-empty-state');
    const summary = document.getElementById('task-summary');

    taskList.innerHTML = '';

    if (!state.selectedClient) {
        emptyState.textContent = 'Select a client to view tasks.';
        emptyState.hidden = false;
        summary.textContent = 'No client selected.';
        return;
    }

    let tasks = state.tasks.filter(
        task => task.clientId === state.selectedClient.id
    );

    const statusFilter = document.getElementById('status-filter').value;
    const categoryFilter = document.getElementById('category-filter').value.toLowerCase();

    if (statusFilter !== 'all') {
        tasks = tasks.filter(task => task.status === statusFilter);
    }

    if (categoryFilter) {
        tasks = tasks.filter(task =>
            task.category?.toLowerCase().includes(categoryFilter)
        );
    }

    if (!tasks.length) {
        emptyState.textContent = 'No tasks found for this client.';
        emptyState.hidden = false;
        summary.textContent = '0 tasks';
        return;
    }

    emptyState.hidden = true;

    summary.textContent = `${tasks.length} task(s)`;

    tasks.forEach(task => {
        const div = document.createElement('div');
        div.className = 'task-item';

        const isOverdue =
            task.status === 'pending' &&
            new Date(task.dueDate) < new Date();

        if (task.status === 'completed') {
            div.classList.add('completed');
        }

        if (isOverdue) {
            div.classList.add('overdue');
        }

        div.innerHTML = `
            <strong>${task.title}</strong>
            <p>${task.description || ''}</p>
            <small>
                ${task.category || ''} • ${task.priority || ''} • Due: ${task.dueDate || ''}
            </small>
        `;

        const toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.className = task.status === 'completed' ? 'task-toggle-btn pending-btn' : 'task-toggle-btn complete-btn';
        toggleButton.textContent = task.status === 'completed' ? 'Mark as Pending' : 'Mark as Complete';
        toggleButton.addEventListener('click', async () => {
            await updateTaskStatus(task.id, task.status === 'completed' ? 'pending' : 'completed');
        });

        div.appendChild(toggleButton);

        taskList.appendChild(div);
    });
}

async function fetchTasks(clientId) {
    try {
        const status = document.getElementById('status-filter').value;
        const category = document.getElementById('category-filter').value;

        const response = await axios.get('http://localhost:3000/api/tasks', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            params: {
                clientId,
                status,
                category
            }
        });

        state.tasks = response.data.tasks;

        renderTasks();

    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

async function updateTaskStatus(taskId, status) {
    try {
        await axios.patch(`http://localhost:3000/api/tasks/${taskId}/status`, {
            status,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (state.selectedClient) {
            await fetchTasks(state.selectedClient.id);
        }

        showMessage(`Task marked as ${status}.`, 'success');
    } catch (error) {
        displayError(error.response?.data?.message || 'Could not update task status');
        console.error('Error updating task status:', error);
    }
}
