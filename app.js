// --- TASK MANAGEMENT SYSTEM ---
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskProjectSelect = document.getElementById('task-project-select');
const taskList = document.getElementById('task-list');

const defaultTasks = [
    { text: "Draft verse focusing on internal discipline and the mental grind", project: "Creative Work" },
    { text: "Adjust lighting and character prominence on the new cover design", project: "Creative Work" },
    { text: "Develop initial soft pad melody for project starting point", project: "Technical Projects" }
];

let tasks = JSON.parse(localStorage.getItem('lop_tasks')) || defaultTasks;

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <span class="task-text">${task.text}</span>
                <br><span class="tag">${task.project}</span>
            </div>
            <button onclick="deleteTask(${index})" style="background:var(--danger); padding: 0.4rem 0.8rem; font-size:0.85rem;">Remove</button>
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

const preSessionInputs = document.getElementById('pre-session-inputs');
const postSessionReview = document.getElementById('post-session-review');

const studySubject = document.getElementById('study-subject');
const studyTopic = document.getElementById('study-topic');
const studyProjectSelect = document.getElementById('study-project-select');
const subjectiveExperience = document.getElementById('subjective-experience');
const sessionList = document.getElementById('session-list');

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
    sessions.forEach((session, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="session-details">
                <strong>${session.subject}</strong> (${session.topic})
                <small>Project: <strong>${session.project}</strong></small>
                <small>Actual: ${session.duration} | Perceived: ${session.subjective}</small>
                <small style="color: var(--text-muted); font-size: 0.75rem;">Logged: ${session.date}</small>
            </div>
            <button onclick="deleteSession(${index})" style="background:var(--danger); padding: 0.4rem 0.8rem; font-size:0.85rem;">Remove</button>
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
        
        // Add pulsing visual alert highlight
        timerCard.classList.add('review-active');
    } else {
        isTiming = true;
        timerBtn.textContent = "Stop Session";
        timerBtn.classList.add('running');
        
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
        date: new Date().toLocaleDateString()
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
    
    timerBtn.textContent = "Start Focus Block";
    timerBtn.classList.remove('running');
    
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