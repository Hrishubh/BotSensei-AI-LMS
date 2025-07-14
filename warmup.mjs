import { exec, spawn } from 'child_process';
import { setTimeout as sleep } from 'timers/promises';

const chromePath = `C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe`; // no quotes
const base = 'http://localhost:3000';

const routes = [
  '/', '/create',
  '/dashboard', '/dashboard/analytics', '/dashboard/courses',
  '/dashboard/mathai', '/dashboard/profile', '/dashboard/settings',
  '/course/2708cb44-e01e-4b53-9ac1-97708a0abcdd',
  '/course/2708cb44-e01e-4b53-9ac1-97708a0abcdd/flashcards',
  '/course/2708cb44-e01e-4b53-9ac1-97708a0abcdd/notes',
  '/course/2708cb44-e01e-4b53-9ac1-97708a0abcdd/qa',
  '/course/2708cb44-e01e-4b53-9ac1-97708a0abcdd/quiz',
];

// Build URLs into one array
const urls = routes.map(r => `${base}${r}`);

console.log('🚀 Launching Chrome with all warmup routes...');

// Open Chrome with all tabs at once
const chromeProcess = spawn(chromePath, [
  '--new-window',
  '--disable-popup-blocking',
  '--no-first-run',
  '--user-data-dir=C:\\temp\\chrome-warmup-profile',
  ...urls,
]);

chromeProcess.on('error', (err) => {
  console.error('❌ Failed to launch Chrome:', err.message);
  process.exit(1);
});

const chromePID = chromeProcess.pid;

console.log(`✅ Chrome launched with PID ${chromePID}`);
urls.forEach(url => console.log(`🌐 Opened ${url}`));
