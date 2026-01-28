import express from 'express';
import {
  getUserLocaController,
  setUserLocationController,
  getAllUserLocations,
} from '../controllers/userLoca.controller.js';

const router = express.Router();

router.get('/', getAllUserLocations);
router.post('/:id', setUserLocationController);
router.get('/:id', getUserLocaController);

export default router;
