import { getWeather, getForecast } from '../services/weather.service.js';

export async function getCurrentWeather(req, res) {
  const { ville } = req.params;
  const { lang = 'fr' } = req.query;

  const weather = await getWeather(decodeURIComponent(ville), lang);
  res.json(weather);
}

export async function getWeatherForecast(req, res) {
  const { ville } = req.params;
  const { lang = 'fr' } = req.query;

  const forecast = await getForecast(decodeURIComponent(ville), lang);
  res.json(forecast);
}
