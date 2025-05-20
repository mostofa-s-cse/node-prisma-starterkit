import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = {
          email: profile.emails![0].value,
          firstName: profile.name!.givenName,
          lastName: profile.name!.familyName,
          googleId: profile.id,
        };

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
); 