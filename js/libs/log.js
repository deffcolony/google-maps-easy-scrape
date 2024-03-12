
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
    const template = `%c[${timestamp}][${level}]%c ${message}`;
  
    switch (level) {
      case 'INFO':
        console.log(template, `background: ${colorConfig.background}; color: ${colorConfig.color}; padding: 2px 6px; border-radius: 4px;`, '');
        break;
      case 'WARNING':
        console.log(template, `background: ${colorConfig.background}; color: ${colorConfig.color}; padding: 2px 6px; border-radius: 4px;`, '');
        break;
      case 'ERROR':
        console.log(template, `background: ${colorConfig.background}; color: ${colorConfig.color}; padding: 2px 6px; border-radius: 4px;`, '');
        break;
      default:
        console.log(template, `background: ${colorConfig.background}; color: ${colorConfig.color}; padding: 2px 6px; border-radius: 4px;`, '');
    }
}