let timeLeft;
let timerId = null;
let isWorkTime = true;
let todaysFocus = 0; // in seconds
let currentStreak = 0;
let bestStreak = 0;
let lastActiveDate = null;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const workModeButton = document.getElementById('work-mode');
const restModeButton = document.getElementById('rest-mode');
const themeToggle = document.getElementById('theme-toggle');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

// Initialize theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    isDarkMode = savedTheme === 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

themeToggle.addEventListener('click', toggleTheme);

function updateDisplay(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function switchMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    modeText.textContent = isWorkTime ? 'Time to focus!' : 'Time to rest!';
    workModeButton.textContent = isWorkTime ? 'Rest Mode' : 'Work Mode';
    workModeButton.setAttribute('data-mode', isWorkTime ? 'work' : 'rest');
    updateDisplay(timeLeft);
}

function startTimer() {
    if (timerId !== null) return;
    
    if (!timeLeft) {
        timeLeft = WORK_TIME;
    }

    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay(timeLeft);

        if (isWorkTime) {
            todaysFocus++;
            updateStatsDisplay();
            saveStats();
        }

        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            switchMode();
            alert(isWorkTime ? 'Break time is over! Time to work!' : 'Work time is over! Take a break!');
        }
    }, 1000);

    startButton.textContent = 'Pause';
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = WORK_TIME;
    modeText.textContent = 'Work Time';
    updateDisplay(timeLeft);
    startButton.textContent = 'Start';
}

startButton.addEventListener('click', () => {
    if (timerId === null) {
        startTimer();
    } else {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
    }
});

resetButton.addEventListener('click', resetTimer);

workModeButton.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    modeText.textContent = isWorkTime ? 'Time to focus!' : 'Time to rest!';
    workModeButton.textContent = isWorkTime ? 'Rest Mode' : 'Work Mode';
    workModeButton.setAttribute('data-mode', isWorkTime ? 'work' : 'rest');
    updateDisplay(timeLeft);
    startButton.textContent = 'Start';
});

restModeButton.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = false;
    timeLeft = BREAK_TIME;
    modeText.textContent = 'Break Time';
    updateDisplay(timeLeft);
    startButton.textContent = 'Start';
});

// Initialize the display and button text
timeLeft = WORK_TIME;
updateDisplay(timeLeft);
workModeButton.textContent = 'Rest Mode';
workModeButton.setAttribute('data-mode', 'work');
