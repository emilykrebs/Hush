const express = require('express');
const userController = require('./userController');

const userRouter = express.Router();

userRouter.post('/create',
  userController.createUser,
  (req, res) => {
    res.status(res.locals.status).json({created : res.locals.created, username : res.locals.username, name: res.locals.name });
  });


userRouter.post('/getUsers',
  userController.getUsers,
  (req, res) => {
    res.status(res.locals.status).json({users: res.locals.users});
  } 
);


userRouter.post('/verify',
  userController.verifyUser,
  (req, res) => {
    res.status(res.locals.status).json({verified: res.locals.verified, name: res.locals.name});
  }
);


module.exports = userRouter;
