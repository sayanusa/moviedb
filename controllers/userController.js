const { users } = require('../models')
const { decryptPwd } = require('../helpers/bcrypt')
const { tokenGenerator } = require('../helpers/jwt')

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class UserController {
    static async userList(req, res, next) {        
        try {
            const result = await users.findAll({
                order: [
                    ['id', 'ASC']
                ]
                // include: [
                //     movies
                // ]
            })
            res.status(200).json(result);
            // res.render('user.ejs', {users: result})
        }
        catch (err){
            next(err);
        }
    }

    static async userRegister(req, res, next){
        const { fullname, username, profileimage, age, gender, email, password, role } = req.body;
        //const profileimage = req.file.path;
        // console.log(req.body)
        // console.log(req.file);
        try {
            const foundemail = await users.findOne({   
                where: { email },
            });
            const foundusername = await users.findOne({   //tambahin username
                where: { username },
            });
            if (foundemail || foundusername){
                res.status(409).json({
                    msg:"email or username already registered" //tambah
                })
            }else{
                const user = await users.create({
                    fullname,
                    username,
                    profileimage,
                    age,
                    gender,
                    email,
                    password,
                    role
                });
                const access_token = tokenGenerator(user)
                res.status(201).json({access_token});
                // res.redirect('/user')    
            }
            //console.log(password);
            //console.log(found);
        }catch (err){
            console.log(err);
            next(err);
        } 
    }

    static async userLogin(req, res, next){
        const { username, password } = req.body;
        try {
            const userFound = await users.findOne ({
                where: {
                    username
                }
            })
            if (userFound){
                if (decryptPwd(password, userFound.password)){
                    const access_token = tokenGenerator (userFound)
                    res.status(200).json({access_token})
                }else{
                    res.status(404).json({
                        msg: 'invalid password'
                    })
                }
            }else{
                    res.status(404).json({
                        msg: 'user not found'
                    })
                }
        }catch(err){
            next(err);
        }
    }

    static async updateFormUser (req, res, next){
        const id = req.userData.id;
        try {
            const result = await users.findOne({
                where: { id }
            })
            res.status(200).json(result)
            // res.render('updateUser.ejs', {users:result});
        }
        catch(err){
            next(err);
        }
    }

    static async updateUser (req, res, next){
        const id = req.userData.id;
        const { fullname, username, age, gender, email, password, role } = req.body;
        const profileimage = "https://pacific-mountain-56035.herokuapp.com/" + req.file.path;
        // console.log(id)
        // console.log(req.body)
        try{
            const result = await users.update({
                fullname,
                username,
                profileimage,
                age,
                gender,
                email,
                password,
                role
        }, {
            where: { id }
        });
        res.status(200).json(result)
        // console.log(result)
            // res.redirect('/user')
        }catch (err){
            next(err);
        }
    }

    static async deleteUser(req, res, next) {
        const id = req.userData.id
        try {
            const result = await users.destroy({
                where: { id }
            });
            res.status(202).json(result);
        } catch (err) {
            next (err);
        }
    }

    // static async userLogout(req, res, next){
    //     try{
    //         req.user.deleteToken()
    //     }
    //     catch (err) {
    //         next(err);
    //     }
    // }

    static async findById (req, res, next) {
        const id = req.userData.id;
        try {
            const found = await users.findOne({
                where: { id: id }
            });
            if(found){
                res.status(201).json(found);
            } else {
                res.status(409).json({
                    msg: "User doesn't exist!"
                });
            }
        } catch (err) {
            next (err);
        }
    }
}


module.exports = UserController;
