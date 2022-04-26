//imporaion
  var bcrypt =require('bcrypt');
  var jwtUtils=require('../utils/jwt.utils');
  var models=require('../models');
  var asynclib =require('async');//lazemch nsamiwha async 5ater async res ervé
  //constante
  const EMAIL_REGEX=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const  PASSWORD_REGEX=/^(?=.*\d).{4,8}$/
  //routes
   module.exports={
       register:function(req,res){
           //recherche des parametres fl request mawjoudinn ou pas 
          var email=req.body.email;
          var username=req.body.username;
          var password=req.body.password;
          var bio=req.body.bio; 
          // verfier si kolhom mmawjoudin ou pas
          if(email==null || username==null || password == null){
              return res.status(400).json({'error':'missing aprametres'});
}
          //verfier les taille des mail les formats des parametres correct ou pas 
          //avant ajouter user il faut verfier s'il exist ou pas
         
         if(username.length >= 13 ||username.length<= 4)
         {
            return res.status(400).json({'error':'wrong username (must be length 5 - 12)'});
         }
         if(!EMAIL_REGEX.test(email))
         {
            return res.status(400).json({'error':'email is not valid'});
         }
         if(!PASSWORD_REGEX.test(password))
         {
            return res.status(400).json({'error':'password is not valid ( must length 4 - 8 and include 1 number '});
         }
         
         
         asyncLib.waterfall([
            function(done) {
              models.User.findOne({
                attributes: ['email'],
                where: { email: email }
              })
              .then(function(userFound) {
                done(null, userFound);
              })
              .catch(function(err) {
                return res.status(500).json({ 'error': 'unable to verify user' });
              });
            },
            function(userFound, done) {
              if (!userFound) {
                bcrypt.hash(password, 5, function( err, bcryptedPassword ) {
                  done(null, userFound, bcryptedPassword);
                });
              } else {
                return res.status(409).json({ 'error': 'user already exist' });
              }
            },
            function(userFound, bcryptedPassword, done) {
              var newUser = models.User.create({
                email: email,
                username: username,
                password: bcryptedPassword,
                bio: bio,
                isAdmin: 0
              })
              .then(function(newUser) {
                done(newUser);
              })
              .catch(function(err) {
                return res.status(500).json({ 'error': 'cannot add user' });
              });
            }
          ], function(newUser) {
            if (newUser) {
              return res.status(201).json({
                'userId': newUser.id
              });
            } else {
              return res.status(500).json({ 'error': 'cannot add user' });
            }
          });
        },
        login: function(req, res) {
          
          // Params
          var email    = req.body.email;
          var password = req.body.password;
      
          if (email == null ||  password == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
          }
      
          asyncLib.waterfall([
            function(done) {
              models.User.findOne({
                where: { email: email }
              })
              .then(function(userFound) {
                done(null, userFound);
              })
              .catch(function(err) {
                return res.status(500).json({ 'error': 'unable to verify user' });
              });
            },
            function(userFound, done) {
              if (userFound) {
                bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
                  done(null, userFound, resBycrypt);
                });
              } else {
                return res.status(404).json({ 'error': 'user not exist in DB' });
              }
            },
            function(userFound, resBycrypt, done) {
              if(resBycrypt) {
                done(userFound);
              } else {
                return res.status(403).json({ 'error': 'invalid password' });
              }
            }
          ], function(userFound) {
            if (userFound) {
              return res.status(201).json({
                'userId': userFound.id,
                'token': jwtUtils.generateTokenForUser(userFound)
              });
            } else {
              return res.status(500).json({ 'error': 'cannot log on user' });
            }
          });
        },
   }