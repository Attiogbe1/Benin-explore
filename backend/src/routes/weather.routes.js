import { Router } from 'express';
import { getCurrentWeather, getWeatherForecast } from '../controllers/weather.controller.js';

const router = Router();

router.get('/:ville', getCurrentWeather);
router.get('/:ville/previsions', getWeatherForecast);

export default router;
