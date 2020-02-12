var User = require('../models/user');
var Plugin = require('../models/plugin');
const jwt = require('jsonwebtoken');


//Controller for User
var UserController = {

  login : async(req, res)=>{
    try {
      const { email, password } = req.body
      const user = await User.findByCredentials(email, password)
      if (!user) {
        return res.status(401).send({error: 'Login failed! Check authentication credentials'})
      }
      const token = await user.generateAuthToken()
      res.send({ user, token })
    } catch (error) {
      res.status(403).send({error: error.message})
    }
  },

  //Create a User
  register : async(req, res)=>{
    try {
      const email = req.body.email
      const user = await User.findByEmail(email)
      if (user) {
        return res.status(403).send({error: 'Email already use'})
      }
      user = new User(req.body);
      user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({ user, token });
    } catch (error) {
      res.status(400).send({error: error.message});
    }
  },

  logout : async(req,res)=>{
    // Log user out of the application
    try {
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token != req.token
      })
      await req.user.save()
      res.send()
    } catch (error) {
      res.status(500).send({error: error.message})
    }
  },

  logoutall : async(req, res) => {
    // Log user out of all devices
    try {
      req.user.tokens.splice(0, req.user.tokens.length)
      await req.user.save()
      res.send()
    } catch (error) {
      res.status(500).send({error: error.message})
    }
  },

  submissionForm : async(req, res) => {
    // save a the plugin form in db
    try {
      const token = req.header('authorization').split(' ')[1];
      const data = jwt.verify(token, process.env.JWT_KEY)
      const user = await User.findOne({ _id: data._id, 'tokens.token': token })
      /*if (plugin) {
          return res.status(403).send({error: 'Name and version already use'})
      }*/
      plugin = new Plugin({
        name : req.body.name,
        version : req.body.version,
        description : req.body.description,
        isOpenSource : req.body.isOpenSource,
        tags : req.body.tags,
        urls : req.body.urls,
        pluginImage : req.file.path,
        user : user.name
      });
      plugin.save();
      res.send();
    } catch (error) {
      res.status(500).send({error: error.message})
    }
  }

}

module.exports = UserController;