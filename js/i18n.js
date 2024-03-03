// Define log level colors
const logColors = {
    INFO: { background: '#007bff', color: '#fff' },
    WARNING: { background: '#ffc107', color: '#000' },
    ERROR: { background: '#dc3545', color: '#fff' },
    DEFAULT: { background: '#6c757d', color: '#fff' }
  };
  
  // Function to get the current timestamp in a readable format
  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  
  // Function to log messages with custom formatting
  function log(message, level = 'INFO') {
    const timestamp = getCurrentTime();
    const colorConfig = logColors[level] || logColors.DEFAULT;
    console.log(`%c[${timestamp}][${level}]`, `background: ${colorConfig.background}; color: ${colorConfig.color}; padding: 2px 6px; border-radius: 4px;`, message);
  }
  
  log('i18n script loaded', 'INFO');

// Function to load translation messages for a specific language
function loadMessages(language) {
  log(`Loading translation messages for language: ${language}`);
    return new Promise((resolve, reject) => {
      chrome.runtime.getPackageDirectoryEntry((root) => {
        console.log('root', root)
        root.getFile(`./locales/${language}.json`, {}, (fileEntry) => {
          fileEntry.file((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              try {
                const messages = JSON.parse(reader.result);
                resolve(messages);
              } catch (error) {
                reject(error);
              }
            };
            reader.readAsText(file);
          });
        }, reject);
      });
    });
  }
  
  // Function to initialize translations
  async function initTranslations() {
    // Retrieve the user's preferred language (or fallback to default)
    const language = chrome.i18n.getUILanguage();
  
    // Load translation messages for the detected language
    try {
      const messages = await loadMessages(language);
      chrome.i18n.messages = messages;
      log(`Translation messages loaded for language: ${language}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log(`Failed to load translation messages for language: ${language}. Error: ${errorMessage}`, 'ERROR');
      console.error(error);
    }
  }
  
  // Initialize translations when the extension is loaded
  initTranslations();
  