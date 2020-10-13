const { Movie, Review, users, MoviexCategory, Category } = require('../models');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { paginate } = require('../helpers/pagination');

class MovieController {
    static async getMovie (req, res) {
        const page = req.query.page;
        const limit = req.query.limit;

        try{           
            const movielist = await Movie.findAll({
                order: [
                    ['id', 'ASC']
                ],
                include : [
                    Review, users
                ],
            });
            const result = paginate(page, limit, movielist);
            res.status(200).json(result);
        } catch (err) {
            next (err);
        }
    }

    static async addFormMovie (req, res, next) {
        try{
            res.status(200).json({
                msg: "ke form add"
            });
        } catch (err) {
            next (err);
        }
    }

    static async addMovie (req, res, next) {
        const poster = "https://pacific-mountain-56035.herokuapp.com/" + req.file.path;
        const { title, synopsis, year, trailer, director, budget } = req.body;
        const userId = req.userData.id;
        try{
            const found = await Movie.findOne({
                where: {
                    title
                }
            });
            if (found){
                res.status(409).json({
                    msg: "title already exist! input another title!"
                })
            } else {
                const movie = await Movie.create({
                    title,
                    synopsis,
                    year,
                    trailer,
                    poster,
                    director,
                    budget,
                    userId
                })
                res.status(201).json(movie);                
            }
        } catch (err) {
            next (err);
        }
    }

    static async deleteMovie (req, res, next) {
        const id = req.params.id;
        try{
            const result = await Movie.destroy({
                where: { id }
            });
            res.status(201).json({
                msg: `Movie deleted successfully!`
            });  
        } catch (err) {
            next (err);
        }
    }

    static async editFormMovie (req, res, next) {
        const id = req.params.id;
        try{
            const found = await Movie.findOne({
                where : { id }
            });
            res.status(200).json({
                msg: "ke form edit"
            });
        } catch (err) {
            next (err);
        }
    }

    static async editMovie (req, res, next) {
        const poster = "https://pacific-mountain-56035.herokuapp.com/" + req.file.path;
        const id = req.params.id;
        const { title, synopsis, year, trailer, director, budget } = req.body;
        try{
            const movie = await Movie.update({
                title,
                synopsis,
                year,
                trailer,
                poster,
                director,
                budget
            },{
                where: { id }
            });
            res.status(201).json({
                msg: "Movie edited successfully!"
            }); 
        } catch (err) {
            next (err);
        }
    }

    static async searchMovie (req, res, next) {
        const { title } = req.query;
        try {
            const found = await Movie.findAll({
                order: [
                    ['id', 'ASC']
                ],
                where: {
                    title: {
                        [Op.iLike]: '%' + title + '%'
                    }
                }
            });
            if(found){
                res.status(201).json(found);
            } else {
                res.status(409).json({
                    msg: "Movie is not available!"
                });
            }
        } catch (err) {
            next (err);
        }
    }

    static async searchById (req, res, next) {
        const id = req.params.id;
        try {
            const found = await Movie.findOne({
                where: { id }
            });
            if(found){
                res.status(201).json(found);
            } else {
                res.status(409).json({
                    msg: "Movie is not available!"
                });
            }
        } catch (err) {
            next (err);
        }
    }

    static async findById (req, res, next) {
        const id = req.params.id;
        try {
            const found = await MoviexCategory.findAll({
                where: { MovieId: id },
                include : [ 
                    Category
                ]
            });
            if(found){
                res.status(201).json(found);
            } else {
                res.status(409).json({
                    msg: "Movie is not available!"
                });
            }
        } catch (err) {
            next (err);
        }
    }

}

module.exports = MovieController;