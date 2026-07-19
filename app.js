// --- TASK MANAGEMENT SYSTEM ---
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskProjectSelect = document.getElementById('task-project-select');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');

const defaultTasks = [
    { text: "Draft verse focusing on internal discipline and the mental grind", project: "Creative Work" },
    { text: "Adjust lighting and character prominence on the new cover design", project: "Creative Work" },
    { text: "Develop initial soft pad melody for project starting point", project: "Technical Projects" }
];

let tasks = JSON.parse(localStorage.getItem('lop_tasks')) || defaultTasks;

function escapeHTML(value) {
    const element = document.createElement('div');
    element.textContent = value;
    return element.innerHTML;
}

function renderTasks() {
    taskList.innerHTML = '';
    taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`;

    if (!tasks.length) {
        taskList.innerHTML = '<li class="empty-state">Your list is clear. Add one meaningful next step.</li>';
        return;
    }

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <span class="task-text">${escapeHTML(task.text)}</span>
                <br><span class="tag">${escapeHTML(task.project)}</span>
            </div>
            <button class="remove-btn" onclick="deleteTask(${index})" aria-label="Remove ${escapeHTML(task.text)}">Remove</button>
        `;
        taskList.appendChild(li);
    });
}

function addTask(e) {
    e.preventDefault();
    const newTaskText = taskInput.value.trim();
    const selectedProject = taskProjectSelect.value;
    
    if (newTaskText) {
        tasks.push({ text: newTaskText, project: selectedProject });
        localStorage.setItem('lop_tasks', JSON.stringify(tasks));
        taskInput.value = '';
        renderTasks();
    }
}

window.deleteTask = function(index) {
    tasks.splice(index, 1);
    localStorage.setItem('lop_tasks', JSON.stringify(tasks));
    renderTasks();
}

taskForm.addEventListener('submit', addTask);


// --- TEMPORAL & STUDY TRACKER SYSTEM ---
const timerCard = document.querySelector('.timer-card');
const timerDisplay = document.getElementById('timer-display');
const timerBtn = document.getElementById('timer-btn');
const saveSessionBtn = document.getElementById('save-session-btn');
const timerState = document.getElementById('timer-state');

const preSessionInputs = document.getElementById('pre-session-inputs');
const postSessionReview = document.getElementById('post-session-review');

const studySubject = document.getElementById('study-subject');
const studyTopic = document.getElementById('study-topic');
const studyProjectSelect = document.getElementById('study-project-select');
const subjectiveExperience = document.getElementById('subjective-experience');
const sessionList = document.getElementById('session-list');
const sessionCount = document.getElementById('session-count');

let timerInterval = null;
let totalSeconds = 0;
let isTiming = false;

let sessions = JSON.parse(localStorage.getItem('lop_sessions')) || [
    { 
        subject: "Songwriting", 
        topic: "Grounded Realism Verses", 
        project: "Creative Work",
        duration: "00:45:00", 
        subjective: "Felt faster (Time Flew)", 
        date: "2026-04-18" 
    }
];

function formatTime(seconds) {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

function renderSessions() {
    sessionList.innerHTML = '';
    sessionCount.textContent = `${sessions.length} logged`;

    if (!sessions.length) {
        sessionList.innerHTML = '<li class="empty-state">No sessions logged yet. Your focused work will appear here.</li>';
        return;
    }

    sessions.forEach((session, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="session-details">
                <strong>${escapeHTML(session.subject)}</strong>
                <small>${escapeHTML(session.topic)} · ${escapeHTML(session.project)}</small>
                <small>Actual ${escapeHTML(session.duration)} · ${escapeHTML(session.subjective)}</small>
                <small>Logged ${escapeHTML(session.date)}</small>
            </div>
            <button class="remove-btn" onclick="deleteSession(${index})" aria-label="Remove ${escapeHTML(session.subject)} session">Remove</button>
        `;
        sessionList.appendChild(li);
    });
}

function toggleTimer() {
    if (isTiming) {
        clearInterval(timerInterval);
        isTiming = false;

        preSessionInputs.style.display = 'none';
        postSessionReview.style.display = 'flex';
        timerState.textContent = 'Review';
        
        // Add pulsing visual alert highlight
        timerCard.classList.add('review-active');
    } else {
        isTiming = true;
        timerBtn.innerHTML = 'Stop session <span aria-hidden="true">■</span>';
        timerBtn.classList.add('running');
        timerState.textContent = 'In progress';
        
        studySubject.disabled = true;
        studyTopic.disabled = true;
        studyProjectSelect.disabled = true;

        timerInterval = setInterval(() => {
            totalSeconds++;
            timerDisplay.textContent = formatTime(totalSeconds);
        }, 1000);
    }
}

function saveFinalSession() {
    const subject = studySubject.value.trim() || "General Session";
    const topic = studyTopic.value.trim() || "Uncategorized Work";
    const project = studyProjectSelect.value;
    const subjective = subjectiveExperience.value;
    
    const newSession = {
        subject: subject,
        topic: topic,
        project: project,
        duration: formatTime(totalSeconds),
        subjective: subjective,
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    };

    sessions.push(newSession);
    localStorage.setItem('lop_sessions', JSON.stringify(sessions));
    
    studySubject.value = '';
    studyTopic.value = '';
    studySubject.disabled = false;
    studyTopic.disabled = false;
    studyProjectSelect.disabled = false;
    
    totalSeconds = 0;
    timerDisplay.textContent = "00:00:00";
    
    timerBtn.innerHTML = 'Start focus block <span aria-hidden="true">→</span>';
    timerBtn.classList.remove('running');
    timerState.textContent = 'Ready';
    
    postSessionReview.style.display = 'none';
    preSessionInputs.style.display = 'flex';
    
    // Remove the pulsing visual alert highlight
    timerCard.classList.remove('review-active');
    
    renderSessions();
}

window.deleteSession = function(index) {
    sessions.splice(index, 1);
    localStorage.setItem('lop_sessions', JSON.stringify(sessions));
    renderSessions();
}

timerBtn.addEventListener('click', toggleTimer);
saveSessionBtn.addEventListener('click', saveFinalSession);

// --- INITIAL RENDER ---
renderTasks();
renderSessions();
