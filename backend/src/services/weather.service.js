import axios from 'axios';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getWeather(ville, lang = 'fr') {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error('Clé API météo non configurée');

  const { data } = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: `${ville},BJ`,
      appid: apiKey,
      units: 'metric',
      lang
    }
  });

  return {
    ville: data.name,
    temperature: Math.round(data.main.temp),
    ressenti: Math.round(data.main.feels_like),
    humidite: data.main.humidity,
    description: data.weather[0].description,
    icone: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    vent: Math.round(data.wind.speed * 3.6),
    visibilite: data.visibility ? Math.round(data.visibility / 1000) : null,
    lever: new Date(data.sys.sunrise * 1000).toISOString(),
    coucher: new Date(data.sys.sunset * 1000).toISOString()
  };
}

export async function getForecast(ville, lang = 'fr') {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error('Clé API météo non configurée');

  const { data } = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      q: `${ville},BJ`,
      appid: apiKey,
      units: 'metric',
      lang,
      cnt: 40
    }
  });

  const days = {};
  data.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!days[date]) {
      days[date] = {
        date,
        tempMax: item.main.temp_max,
        tempMin: item.main.temp_min,
        description: item.weather[0].description,
        icone: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
      };
    } else {
      days[date].tempMax = Math.max(days[date].tempMax, item.main.temp_max);
      days[date].tempMin = Math.min(days[date].tempMin, item.main.temp_min);
    }
  });

  return Object.values(days).slice(0, 7).map(d => ({
    ...d,
    tempMax: Math.round(d.tempMax),
    tempMin: Math.round(d.tempMin)
  }));
}
