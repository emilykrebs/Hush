const express = require('express');
const groupConvoController = require('./groupConvoController')

const groupConvoRouter = express.Router();


// Create a conversation in the database
// localhost://3000/conversation

// Get a conversation from the database
// localhost://3000/conversation/"username"

//test dummy
groupConvoRouter.post('/groupconvo',
groupConvoController.findGroupConversation,
  (req, res) => {
    res.status(res.locals.status).json({cid: res.locals.convoId, conversation: res.locals.messages});
  });

  groupConvoRouter.post('/groupuserconvos',
  groupConvoController.getAllGroupConvosForAUser,
  (req, res) => {
    res.status(res.locals.status).json({conversations : res.locals.conversations});
  });

  

// Append to a conversation
// localhost://3000/conversation/"username"

// Delete a conversation
// localhost://3000/conversation/"name"

module.exports = groupConvoRouter;