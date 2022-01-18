import { Film as FilmModel } from '../models';

export class Film {
  constructor(data) {
    this.models = {
      film: new FilmModel(data),
    };
  }

  async create() {
    const data = await this.models.film.create();

    return data;
  }

  async getFilm(filmId) {
    const data = await this.models.film.getFilm(filmId);

    return data;
  }

  async deleteFilm(filmId) {
    const data = await this.models.film.deleteFilm(filmId);

    return data;
  }

  async getFilms() {
    const data = await this.models.film.getFilms();

    return data;
  }

  async getAdminFilms(user) {
    const data = await this.models.film.getAdminFilms(user);

    return data;
  }

  async getPublicFilms() {}

  async isUnique() {
    const data = await this.models.film.isUnique();

    return data;
  }
}
