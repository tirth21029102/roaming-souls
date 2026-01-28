import {
  getUserLoca,
  setUserLoca,
  getAllUsersPresentLocation,
  updateUserLoca,
  getUsersInfoLocations,
} from '../database/index.js';

export const getUserLocaController = async (req, res) => {
  const [data] = await getUserLoca(req.params.id);
  if (data.length === 0)
    return res.status(404).json({
      status: 'failed',
      message: `no location data exist for user with id = ${req.params.id}`,
    });
  return res.status(200).json({
    status: 'success',
    data: data,
  });
};

export const setUserLocationController = async (req, res) => {
  const userId = req.params.id;
  const { countryCode, countryName, name, lat, lng } = req.body;

  const userLocationInfo = await getUserLoca(userId);

  const result =
    (await userLocationInfo.length) === 0
      ? setUserLoca(userId, countryCode, countryName, name, lat, lng)
      : updateUserLoca(userId, countryCode, countryName, name, lat, lng);

  if (!result || result.affectedRows === 0) {
    return res.status(400).json({
      status: 'failed',
      message: `failed to set location for user with id = ${userId}`,
    });
  }
  return res.status(200).json({
    status: 'success',
    message: 'user location saved successfully',
  });
};

export const getAllUserLocations = async (req, res) => {
  const data = await getAllUsersPresentLocation();
  if (data.length === 0) {
    return res.status(200).json({
      message: 'empty list of user locations',
      data,
    });
  }
  const usersInfoLocations = await getUsersInfoLocations();
  return res.status(200).json({
    status: 'success',
    data,
    usersInfoLocations,
  });
};
