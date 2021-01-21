const models = require('./models'); //models.User //models.Conversation
const Conversation = models.Conversation;
const mongoose = require('mongoose');

const ConversationController = {

  findConversation (req, res, next) {
  
   const { sender, recipient } = req.body;
   
   Conversation.findOne({ participants: [{ name : sender}, { name: recipient }] }) //returns an array with all group convos user has
   .then(allConvosWithSender => {
        console.log(allConvosWithSender, 'ALL GROUP CONVOS')
        if (allConvosWithSender) {
          res.locals.status = 200;
          res.locals.convoId = allConvosWithSender._id;
          res.locals.messages = allConvosWithSender.messages;
          return next();
        } else {
         Conversation.create({_id: mongoose.Types.ObjectId() , participants: [{ name : sender}, { name: recipient }], messages: []})
         .then((mongoResult) => {
             //should return us back an obj = {_id: 24vergverb, participants: [], messages: []}
             res.locals.convoId = mongoResult._id;
             res.locals.status = 200;
             res.locals.messages = mongoResult.messages;
             return next();
           })
           .then(err => {
             console.log(`Error creating group convo: ${err}`)
           })
         }
       })
       .catch(err => {
        console.log(`Error locating group convo: ${err}`);
        return next()
       });
  },

  getAllConvosForAUser (req, res, next) {
    const { username } = req.body; 
    Conversation.find({participants: { name: username } })
    .then( (mongoResult) => {
      if (mongoResult.length === 0){
        res.locals.conversations = [];
        res.locals.status = 204;
        return next();
      } else {
        res.locals.conversations = mongoResult;
        res.locals.status = 200;
        return next();
      }
    })
  }

}


module.exports = ConversationController;