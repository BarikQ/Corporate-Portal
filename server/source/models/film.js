import { film } from '../odm';

export class Film {
  constructor(data) {
    this.data = data;
  }

  async create() {
    try {
      const data = await film.create(this.data);

      return data;
    } catch (error) {
      return error;
    }
  }

  async getFilm(filmId) {
    const data = await film.find({ _id: filmId }, { id: 0, __v: 0, _id: 0, created: 0 });

    return data;
  }

  async deleteFilm(filmId) {
    const data = await film.deleteOne({ _id: filmId });

    return data;
  }

  async getFilms(user) {
    const data = await film.find({}, { __v: 0, id: 0, created: 0, date: 0, description: 0 });

    return data;
  }

  async getAdminFilms(user) {
    try {
      if (user && user.role) {
        let role = Buffer.from(user.role, 'base64').toString();
        if (role === 'admin') {
          const data = await film.find({}, { __v: 0 });

          return data;
        } else {
          throw new Error('User is not admin');
        }
      }

      throw new Error('Role not granted');
    } catch (error) {
      throw new Error(error);
    }
  }

  async isUnique() {
    const data = await film.findOne(this.data);

    return !data;
  }
}
