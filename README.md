[![forthebadge](https://forthebadge.com/images/badges/60-percent-of-the-time-works-every-time.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)

# Skills City Portal Calendar Scraper

I wrote this because I was tired of spending like 20 minutes manually inputting calendar events into outlook.

[![wakatime](https://wakatime.com/badge/user/11612492-942b-4434-89a1-5e31d943fa36/project/6128f755-2ddd-4ef4-b1ce-188971ead674.svg?style=for-the-badge)](https://wakatime.com/badge/github/underscoren/calendarscrape)

# Usage

Get the Tampermonkey extension for your browser.

Download the userscript from this [gist](https://gist.github.com/underscoren/a1e4d0a4807224a840219b6d1cd2e74b) (Click the "Raw" button) (This is how you update it as well) or manually create your own userscript from the repo's `dist/bundle.min.js`.

Once on the Games development course page, scroll down and click the "Download Calendar" button. It will rapidly open all the week tabs to force the content to load, then it will download `calendar.ics`. 

Open the file with the Windows 10 Calendar app (or Outlook, Gmail, Thunderbird, whatever you use that supports ICS) and import the calendar.

Eventually I'll automate this and set up a webcal server. Hopefully.

# Development

Clone the repo, then install using your favorite package manager (npm, yarn, etc)

e.g.
```bash
git clone https://github.com/underscoren/calendarscrape.git
cd calendarscrape
yarn
```

To make a build, simply run the "build" script

```bash
yarn run build
```