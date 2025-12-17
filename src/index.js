const { BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

let mainWindow = null;

/**
 * Create the main application window
 */
function createWindow(sendToRenderer, geminiSessionRef) {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    show: false,
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // 🔥 IMPORTANT PART: LOAD REACT RENDERER
  mainWindow.loadFile(
    path.join(__dirname, '..', 'renderer', 'index.html')
  );

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

/**
 * Update global keyboard shortcuts
 */
function updateGlobalShortcuts(keybinds, win, sendToRenderer, geminiSessionRef) {
  globalShortcut.unregisterAll();

  if (!keybinds) return;

  Object.entries(keybinds).forEach(([action, accelerator]) => {
    if (!accelerator) return;

    try {
      globalShortcut.register(accelerator, () => {
        if (!win) return;

        // Send event to renderer
        sendToRenderer(win, 'keybind-triggered', action);

        // Example Gemini hook (kept untouched)
        if (action === 'toggle-assistant') {
          if (geminiSessionRef.current) {
            sendToRenderer(win, 'assistant-stop');
          } else {
            sendToRenderer(win, 'assistant-start');
          }
        }
      });
    } catch (err) {
      console.error(`Failed to register shortcut ${accelerator}`, err);
    }
  });
}

module.exports = {
  createWindow,
  updateGlobalShortcuts,
};
