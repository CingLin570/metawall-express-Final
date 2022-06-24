const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.CALLBACKURL}/auth/google/callback`,
  },
  (accessToken, refreshToken, profile, cb) => {
    return cb(null, profile._json);
  }
));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: `${process.env.CALLBACKURL}/auth/facebook/callback`,
  profileFields: ['id', 'displayName', 'photos', 'email'],
},
(accessToken, refreshToken, profile, cb) => {
  return cb(null, profile._json);
}
));
