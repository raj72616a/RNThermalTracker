import { WEATHER_API_KEY } from '../weatherApiKey';

async function fetchTemperature () {
    try {
        const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=auto:ip&aqi=no`);
        const json = await res.json();
        return json.current.temp_c;
    }
    catch (e) {
        console.log('Ambient Thermal Fetch error');
        console.log(e);
        return null;
    }
}

export default {
    fetchTemperature : fetchTemperature
}