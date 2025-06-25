// Terminal Idle Hacker Game - "real terminal" style

const output = document.getElementById('output');
const input = document.getElementById('input');
const form = document.getElementById('input-form');
const cursor = document.querySelector('.blinking-cursor');

let state = {
  credits: 0,
  hackPower: 1,
  upgradeCost: 10,
  autoHackLevel: 0,
  autoHackCost: 25,
  lastTick: Date.now()
};

const asciiLogo = [
  "          _____           _        _ _           _             ",
  "         |_   _|__   ___ | | _____| | | ___  ___| |_ ___  _ __ ",
  "           | |/ _ \\ / _ \\| |/ / _ \\ | |/ _ \\/ __| __/ _ \\| '__|",
  "           | | (_) | (_) |   <  __/ | |  __/ (__| || (_) | |   ",
  "           |_|\\___/ \\___/|_|\\_\\___|_|_|\\___|\\___|\\__\\___/|_|   ",
  "         Idle Hacker Terminal      Type 'help' to begin         "
].join('\n');

function print(text = '') {
  output.textContent += text + '\n';
  output.scrollTop = output.scrollHeight;
}

function typePrint(text, speed = 0, cb) {
  // "Typing" effect for output (optional)
  if (!speed) {
    print(text);
    if (cb) cb();
    return;
  }
  let idx = 0;
  function type() {
    if (idx < text.length) {
      output.textContent += text[idx];
      idx++;
      setTimeout(type, speed);
    } else {
      output.textContent += '\n';
      output.scrollTop = output.scrollHeight;
      if (cb) cb();
    }
  }
  type();
}

function showStatus() {
  print(
    `Credits: ${state.credits}\n` +
    `Hack Power: ${state.hackPower}\n` +
    `Upgrade Cost: ${state.upgradeCost}\n` +
    `AutoHack Level: ${state.autoHackLevel}\n` +
    `AutoHack Cost: ${state.autoHackCost}`
  );
}

function help() {
  print(`Available commands:
- hack:        Earn credits instantly
- upgrade:     Double your hack power (costs credits)
- status:      Show your stats
- autohack:    Buy auto-hack (generates credits every second)
- save:        Save your progress
- load:        Load your progress
- ascii:       Show game logo
- help:        Show this help
- clear:       Clear the terminal
- exit:        Reset all progress`);
}

function hack() {
  state.credits += state.hackPower;
  print(`You hacked and earned ${state.hackPower} credits!`);
  showStatus();
}

function upgrade() {
  if (state.credits >= state.upgradeCost) {
    state.credits -= state.upgradeCost;
    state.hackPower *= 2;
    state.upgradeCost = Math.ceil(state.upgradeCost * 2.5);
    print('Hack power upgraded!');
    showStatus();
  } else {
    print(`Not enough credits! Upgrade costs ${state.upgradeCost} credits.`);
  }
}

function autohack() {
  if (state.credits >= state.autoHackCost) {
    state.credits -= state.autoHackCost;
    state.autoHackLevel += 1;
    state.autoHackCost = Math.ceil(state.autoHackCost * 2.7);
    print('AutoHack upgraded! You now hack automatically.');
    showStatus();
  } else {
    print(`Not enough credits! AutoHack costs ${state.autoHackCost} credits.`);
  }
}

function clearTerminal() {
  output.textContent = '';
}

function saveGame() {
  localStorage.setItem('idle-hacker-state', JSON.stringify(state));
  print('Game saved!');
}

function loadGame() {
  const s = localStorage.getItem('idle-hacker-state');
  if (s) {
    state = JSON.parse(s);
    print('Game loaded.');
    showStatus();
  } else {
    print('No saved game found.');
  }
}

function showASCII() {
  print(asciiLogo);
}

function exitGame() {
  localStorage.removeItem('idle-hacker-state');
  state = {
    credits: 0,
    hackPower: 1,
    upgradeCost: 10,
    autoHackLevel: 0,
    autoHackCost: 25,
    lastTick: Date.now()
  };
  print('Progress reset. Restarting...');
  setTimeout(() => {
    clearTerminal();
    showASCII();
    help();
    showStatus();
  }, 600);
}

function process(cmd) {
  const command = cmd.trim().toLowerCase();
  switch (command) {
    case 'hack':
      hack();
      break;
    case 'upgrade':
      upgrade();
      break;
    case 'status':
      showStatus();
      break;
    case 'autohack':
      autohack();
      break;
    case 'save':
      saveGame();
      break;
    case 'load':
      loadGame();
      break;
    case 'ascii':
      showASCII();
      break;
    case 'help':
      help();
      break;
    case 'clear':
      clearTerminal();
      break;
    case 'exit':
      exitGame();
      break;
    case '':
      break;
    default:
      print(`Unknown command: "${command}". Type "help" for commands.`);
  }
}

// Blinking cursor handling (simulate after input)
let inputFocused = true;
function updateCursor() {
  if (inputFocused && document.activeElement === input) {
    cursor.textContent = '█';
  } else {
    cursor.textContent = '';
  }
}
input.addEventListener('focus', () => { inputFocused = true; updateCursor(); });
input.addEventListener('blur', () => { inputFocused = false; updateCursor(); });
input.addEventListener('input', updateCursor);
input.addEventListener('keydown', updateCursor);

form.addEventListener('submit', e => {
  e.preventDefault();
  const val = input.value;
  print(`$ ${val}`);
  process(val);
  input.value = '';
  updateCursor();
});

function tick() {
  const now = Date.now();
  const dt = (now - state.lastTick) / 1000;
  if (state.autoHackLevel > 0) {
    const earned = Math.floor(state.autoHackLevel * state.hackPower * dt);
    state.credits += earned;
  }
  state.lastTick = now;
}

function mainLoop() {
  tick();
  setTimeout(mainLoop, 1000);
}

// On load, show ASCII logo, help, status, and load game
window.onload = () => {
  clearTerminal();
  typePrint(asciiLogo, 0, () => {
    help();
    loadGame();
    showStatus();
    mainLoop();
    updateCursor();
  });
};
