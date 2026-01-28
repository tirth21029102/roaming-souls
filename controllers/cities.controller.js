import {
  getAllCitiesInfo,
  getCityInfo,
  deleteCityd,
  insertCity,
  getAllCitiesForParticularUser,
} from '../database/index.js';
import AppError from '../utilities/appError.js';
import catchAsync from '../utilities/catchAsync.js';

export const getCities = catchAsync(async (req, res) => {
  const cities = await getAllCitiesInfo();
  if (!cities || cities.length === 0) {
    return res.status(200).json({
      status: 'success',
      data: [],
    });
  }

  res.status(200).json({
    status: 'success',
    data: cities,
  });
});

export const createNewCity = async (req, res) => {
  const {
    cityName: city,
    date,
    note,
    data2: { continent, countryName, lat, lng, user_id },
  } = req.body;
  if (!city || !lat || !lng)
    return res.status(400).json({
      status: 'failed',
      message: 'please enter valid infomation',
    });
  const rows = await insertCity(
    city,
    date,
    note,
    continent,
    countryName,
    lat,
    lng,
    user_id
  );
  return res.status(200).json({
    status: 'success',
    message: 'city added correctly to the database 🏆',
  });
};

export const getCity = async (req, res, next) => {
  const result = await getCityInfo(req.params.id);
  if (!result || result.length === 0) {
    next(new AppError(`city with id ${req.params.id} does not exist`, 404));
  }
  return res.status(200).json({
    status: 'success',
    result,
  });
};

export const deleteCity = async (req, res, next) => {
  const id = req.params.id;
  const result = await deleteCityd(id);
  if (!result.affectedRows)
    return res.status(401).json({
      status: 'failed',
    });
  return res.status(200).json({
    status: 'success',
  });
};

export const getAllCitiesForUser = async (req, res, next) => {
  const cities = await getAllCitiesForParticularUser(req.params.userId);

  if (!cities || cities.length === 0) {
    return res.status(200).json({
      status: 'success',
      data: [],
    });
  }

  res.status(200).json({
    status: 'success',
    data: cities,
  });
};
