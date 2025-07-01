document.addEventListener('DOMContentLoaded', function () {
    const studyForm = document.getElementById('studyForm');
    const subjectInput = document.getElementById('subjectInput');
    const dateInput = document.getElementById('dateInput');
    const studyList = document.getElementById('studyList');
    const feedback = document.getElementById('feedback');
    const todayTitle = document.getElementById('todayTitle');

    function getTodayDateString() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

function loadTasksByDate(date) {
    studyList.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];

    const filteredTasks = tasks
        .map((task, index) => ({ ...task, realIndex: index }))
        .filter(task => task.date === date);

    if (filteredTasks.length > 0) {
        todayTitle.textContent = `MATÉRIAS DO DIA`;
        filteredTasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task');
            taskDiv.innerHTML = `
                <span>${task.subject} - ${task.date}</span>
                <button class="delete-btn" data-index="${task.realIndex}">Excluir</button>
            `;
            studyList.appendChild(taskDiv);
        });
    } else {
        todayTitle.textContent = `Nenhuma matéria para esse dia`;
    }
}

dateInput.addEventListener('change', function () {
    const selectedDate = dateInput.value;
    if (selectedDate) {
        loadTasksByDate(selectedDate);
    }
});

    function loadTasks() {
    studyList.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];
    const today = getTodayDateString();
    const todaysTasks = tasks
        .map((task, index) => ({ ...task, realIndex: index })) // adiciona o índice real
        .filter(task => task.date === today);

    if (todaysTasks.length > 0) {
        todayTitle.textContent = 'MATÉRIAS DE HOJE';
        todaysTasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task');
            taskDiv.innerHTML = `
                <span>${task.subject} - ${task.date}</span>
                <button class="delete-btn" data-index="${task.realIndex}">Excluir</button>
            `;
            studyList.appendChild(taskDiv);
        });
    } else {
        todayTitle.textContent = 'Nenhuma matéria para hoje';
    }
}

    function saveTask(subject, date) {
        const tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];
        tasks.push({ subject, date });
        localStorage.setItem('studyTasks', JSON.stringify(tasks));
        loadTasks();
    }

    function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];
    tasks.splice(index, 1); // deleta diretamente pelo índice real
    localStorage.setItem('studyTasks', JSON.stringify(tasks));
    loadTasks();
}
    studyForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const subject = subjectInput.value.trim();
        const date = dateInput.value;

        if (!subject || !date) {
            feedback.textContent = 'Preencha todos os campos!';
            feedback.className = 'error';
            return;
        }

        feedback.textContent = '';
        saveTask(subject, date);
        subjectInput.value = '';
        dateInput.value = '';
    });

    studyList.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.getAttribute('data-index');
            deleteTask(index);
        }
    });

    loadTasks();
});