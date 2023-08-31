import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import { getUserEmail, getUserPassword } from './database.js';

passport.use(new LocalStrategy(async function verify(email, password, done) {
    const emailDB = await getUserEmail(email);
    const passwordDB = await getUserPassword(email);

    try {
        if (emailDB == null) {
            return done(null, false, { message: 'Nenhum usuário com esse email' });
        } else if (await bcrypt.compare(password, passwordDB)) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Senha incorreta' });
        }
    } catch (err) {
        return done(err);
    }
}))