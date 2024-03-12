let currentlang = "en";
  
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
  