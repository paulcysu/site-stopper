# SiteStopper

SiteStopper is a powerful Chrome extension designed to help you stay focused and productive by blocking distracting websites and content. With SiteStopper, you can easily manage a list of blocked URLs and keywords, allowing you to customize your browsing experience and maintain control over your online activities.

![SiteStopper Logo](/icon48.png)

## Features

- **URL Blocking**: Block specific websites by adding their URLs to your blocklist.
- **Keyword Blocking**: Block content containing specific keywords across all websites.
- **Easy Management**: Simple interface to add, remove, and view blocked URLs and keywords.
- **Instant Updates**: Changes to your blocklist take effect immediately without requiring a browser restart.
- **Neumorphic Design**: Modern and sleek user interface for a pleasant user experience.

## Installation

1. Download the extension files or clone this repository.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click on "Load unpacked" and select the directory containing the extension files.
5. SiteStopper should now appear in your list of installed extensions.

## Usage

1. Click on the SiteStopper icon in your Chrome toolbar to open the popup interface.
2. To block a website:
   - Enter the URL in the "Block URLs" input field.
   - Click the "Add" button or press Enter.
3. To block content containing specific keywords:
   - Enter the keyword in the "Block Keywords" input field.
   - Click the "Add" button or press Enter.
4. To remove a blocked URL or keyword:
   - Click the "×" button next to the item in the list.
5. Your changes are saved automatically and take effect immediately.

## Development

If you want to contribute to SiteStopper or modify it for your own use, follow these steps:

1. Clone this repository:
   ```
   git clone https://github.com/paulcysu/sitestopper.git
   ```
2. Make your changes to the relevant files:
   - `manifest.json`: Extension configuration
   - `popup.html` and `popup.js`: Popup interface and functionality
   - `background.js`: Background processes and rule management
   - `content.js`: Content script for keyword blocking
   - `styles.css`: Styling for the popup interface
3. Test your changes by loading the extension as described in the Installation section.
4. Submit a pull request with your improvements or bug fixes.

## Privacy

SiteStopper respects your privacy. All blocked URLs and keywords are stored locally on your device and are not transmitted to any external servers.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have suggestions for improvements, please open an issue on the GitHub repository or contact us at support@sitestopper.com.

---

Thank you for using SiteStopper! We hope this extension helps you stay focused and productive in your online activities.
