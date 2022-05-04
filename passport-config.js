const LocalStrat = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (login_email, login_password, done) => {
        
        const user = await getUserByEmail(login_email);

        if(user == null){
            return done(null, false, { message: 'No user with that email' });
        }

        try {
            if(await bcrypt.compare(login_password, user.password)) {
                return done(null, user);
            }else{
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch(err) {
            return done(err);
        }

    } 
    
    passport.use(new LocalStrat({ usernameField: 'login_email', passwordField: 'login_password' },
    authenticateUser));

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id,done) => { 
        return done(null, await getUserById(id)) 
     });
}

module.exports = initialize;