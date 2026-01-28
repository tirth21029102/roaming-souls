import express from 'express';

import {
  getCities,
  createNewCity,
  getCity,
  deleteCity,
  getAllCitiesForUser,
} from '../controllers/cities.controller.js';

const router = express.Router();
router.route('/').get(getCities).post(createNewCity);
router.route('/user/:userId').get(getAllCitiesForUser);
router.route('/:id').get(getCity).delete(deleteCity);
export default router;
