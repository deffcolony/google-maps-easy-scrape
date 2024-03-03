let currentlang = "en";

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
  
// log('i18n script loaded', 'INFO');
function setupTranslations( translations ) {
  if (!translations) {
    log('No translations available', 'WARNING');
    return;
  }

  // get all elements with the attribute data-i18n
  const elements = document.querySelectorAll('[data-i18n]');
  // loop through all elements
  elements.forEach((element) => {
    // get the translation key from the element
    const key = element.getAttribute('data-i18n');
    // does key exist in translations object?
    if (!translations[key]) {
      log(`Translation key not found: ${key}`, 'WARNING');
      return;
    }
    // get the translation message from the translations object
    const message = translations[key];
    // set the inner text of the element to the translation message
    element.innerText = message;
  });
}

// Function to load translation messages for a specific language
function loadMessages(language) {
  console.log("%cLoading translation messages for language: " + language, "background: #222; color: #bada55; padding: 0 4px; border-radius: 4px;");
    return new Promise((resolve, reject) => {
      chrome.runtime.getPackageDirectoryEntry((root) => {
        if (!root) {
          reject(new Error('Failed to load package directory'));
          return;
        }

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
 
    chrome.storage.sync.get(['language'], async function(result) {
      if (result.language) {
        const t = await loadMessages( result.language );
        setupTranslations( t["translations"] );
      } else {
        const t = await loadMessages( language );
        setupTranslations( t["translations"] );
      }
    } );
    
    // Load translation messages for the detected language
    // try {
    //   const messages = await loadMessages(language);
    //   chrome.i18n.messages = messages;
    //   log(`Translation messages loaded for language: ${language}`);
    //   setupTranslations( messages["translations"] );
    // } catch (error) {
    //   const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    //   log(`Failed to load translation messages for language: ${language}. Error: ${errorMessage}`, 'ERROR');
    //   console.error(error);
    // }
  }

  async function setLanguage(lang, flags = {}) {
     try {
      chrome.storage.sync.set({ language: lang }, async function() {
        const t = await loadMessages( lang );
        setupTranslations( t["translations"] );
        if (!flags.dontsend) {
          sendMessage({ type: 'language', language: lang });
        } else {
          log("Flag of dontsend is set, not sending message", "INFO")
        }
      });
    } catch (error) {
      console.warn("Error setting language: ", error);
      const t = await loadMessages( lang );
      setupTranslations( t["translations"] );
    }
  }
  
  // Initialize translations when the extension is loaded
  initTranslations();
  