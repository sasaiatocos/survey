import { SessionOptions } from 'express-session';

export const sessionConfig: SessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 },
};