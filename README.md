"# RNThermalTracker" 
RN Android APP to track Device CPU temperature and Ambient Temperature (taken from weather api), and visualize the relationship (or lack of therefore) between the two with a line chart.

Ambient temperature is taken from https://www.weatherapi.com/
An API key (not included in this public repo) is required for the app to build.
If you want to build this project, you may create an account for free at weatherapi.com to obtain your API Key.
Then create a file weatherApiKey.js at the project directory:
```Javascript
export const WEATHER_API_KEY = 'your_api_key_here';
```

The Tracker App is scheduled to take record every 30 minutes (depending on background task throttling by OS) in the background, extra settings by user may be required for certain phone models for it to work.
Instructions for keeping background service alive can be found in below link:
https://dontkillmyapp.com/

Up to the latest 100 temperature records will be kept and visualized when you open the app.