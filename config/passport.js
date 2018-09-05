const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const config = require("./config");
module.exports = passport => {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: config.googleClientID,
        clientSecret: config.googleClientSecret,
        callbackURL: "/auth/google/callback"
      },
      async function(accessToken, refreshToken, profile, cb) {
        const username = profile.emails[0].value;
        const email = profile.emails[0].value;
        try {
          const oldUser = await User.findOne({ email });
          if (oldUser) {
            return cb(null, oldUser);
          }
          const user = new User({
            username,
            email,
            provider: "google"
          });
          const savedUser = await user.save();
          return cb(null, savedUser);
        } catch (error) {
          return cb(error, false);
        }
      }
    )
  );
};
