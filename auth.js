import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import { getUserEmail, getUserPassword } from './database.js';

export function initialize() {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async function verify(email, password, done) {
        const emailDB = await getUserEmail(email);
        const passwordDB = await getUserPassword(email);
    
        try {
            if (emailDB == null) {
                return done(null, false, { message: 'Nenhum usuário com esse email' });
            } else if (await bcrypt.compare(password, passwordDB)) {
                return done(null, email);
            } else {
                return done(null, false, { message: 'Senha incorreta' });
            }
        } catch (err) {
            return done(err);
        }
    }))
    passport.serializeUser(function(user, cb) {
        process.nextTick(function() {
          cb(null, { id: user.id, username: user.username });
        });
      });
      
      passport.deserializeUser(function(user, cb) {
        process.nextTick(function() {
          return cb(null, user);
        });
      });
}