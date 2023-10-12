const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const secretKey = process.env.JWT_SECRET_KEY;
const userModel = require("../api/models/Users")
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretKey;
opts.passReqToCallback = true;
opts.ignoreExpiration = true;
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, async (req, jwt_payload, done) => {
      try {
        
        let to = new Date();
        let today = Math.ceil(to.getTime() / 1000);
        if (jwt_payload.exp < today) {
          return done(null, "Unothorise");
        }
        const user = await userModel.findOne({ _id: jwt_payload._id, status: 1 });
        if (!user) return done(null, false, 'User not found');
        return done(null, user);
      } catch (error) {
        console.error("Some error in passport:", error);
        return done(error, false);
      }

    })
  );
};