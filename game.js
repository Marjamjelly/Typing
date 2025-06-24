// Terminal Idle Hacker Game

const output = document.getElementById('output');
const input = document.getElementById('input');
const form = document.getElementById('input-form');

let state = {
  credits: 0,
  hackPower: 1,
  upgradeCost: 10,
  autoHackLevel: 0,
  autoHackCost: 25,
  lastTick: Date.now()
};

function print(text = '') {
  output.textContent += text + '\n';
  output.scrollTop = output.scrollHeight;
}

function prompt() {
  print('');
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
- hack: Earn credits instantly
- upgrade: Double your hack power (costs credits)
- status: Show your stats
- autohack: Buy auto-hack (generates credits every second)
- help: Show this help
- clear: Clear the terminal`);
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
    case 'help':
      help();
      break;
    case 'clear':
      clearTerminal();
      break;
    case '':
      break;
    default:
      print(`Unknown command: "${command}". Type "help" for commands.`);
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const val = input.value;
  print(`> ${val}`);
  process(val);
  input.value = '';
});

function tick() {
  const now = Date.now();
  const dt = (now - state.lastTick) / 1000;
  if (state.autoHackLevel > 0) {
    const earned = state.autoHackLevel * state.hackPower * dt;
    state.credits += earned;
    // Limit decimals
    state.credits = Math.floor(state.credits);
  }
  state.lastTick = now;
}

function mainLoop() {
  tick();
  setTimeout(mainLoop, 1000);
}

window.onload = () => {
  print('Welcome to Terminal Idle Hacker!');
  help();
  showStatus();
  mainLoop();
};
