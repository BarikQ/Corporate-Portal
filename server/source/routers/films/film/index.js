import { Film } from '../../../controllers';

export const getFilm = async (req, res) => {
  try {
    const film = await new Film();
    const data = await film.getFilm(req.params.id);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: erorr.message });
  }
};

export const putFilm = async (req, res) => {
  try {
    const data = {
      data: { hash: req.params.film },
      body: req.body,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteFilm = async (req, res) => {
  try {
    const film = await new Film();
    const data = await film.deleteFilm(req.params.id);

    if (data.deletedCount >= 1) {
      res.sendStatus(204);
    } else {
      res.status(400).json({ message: 'The movie was not deleted' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
