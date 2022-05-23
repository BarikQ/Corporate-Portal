import formidable from 'formidable';
import cloudinary from 'cloudinary';

import { Film } from '../../controllers';

const cloudinaryRoute = 'iTechArt/Films';

export const get = async (req, res) => {
  try {
    const film = await new Film();
    const data = await film.getFilms();

    res.status(200).json(data);
    return;
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }
};

export const getAdmin = async (req, res) => {
  try {
    const film = await new Film();
    const data = await film.getAdminFilms(req.session.user);

    res.status(200).json(data);
    return;
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }
};

export const post = async (req, res) => {
  try {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400).json({ message: error.message });
        return;
      }

      const folderName = fields.title;
      const posterTitle = fields.title.toLowerCase().replace(/\s/g, '_') + '.poster';

      const cloudinaryResult = await cloudinary.v2.uploader.upload(
        files.poster.path,
        { public_id: `${cloudinaryRoute}/${folderName}/${posterTitle}` },
        (error, result) => {
          if (error) {
            res.status(400).json({ message: error.message });
            return;
          }

          return result;
        }
      );

      const posterURL = cloudinaryResult.url;
      fields.posterURL = posterURL;
      fields.genres = fields.genres.split(',');
      console.log(fields);
      const film = await new Film(fields);
      const isUnique = await film.isUnique();

      if (!isUnique) {
        res.status(400).json({ message: 'This film already exist' });
        return;
      }

      const newFilm = await film.create();
      const data = await film.getAdminFilms(req.session.user);
      console.log(data);
      res.status(201).json(data);
      return;
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }
};
