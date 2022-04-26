 var jwt= require('jsonwebtoken')
 const JWT_SIGN_SECRET='6d6sd6vfds6dgvsdfg6ggdsrgssfrgdrgdrfgdgdg';
 module.exports={
     generateTokenForUser : function(userData){
         return jwt.sign({
             userId: userData.id,
             isAdmin:userData.isAdmin
         },
         JWT_SIGN_SECRET,
         {
            
            expiresIn:'1h'
         })
     }
 }