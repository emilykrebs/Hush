const models = require('./models'); //models.User //models.Conversation
const Conversation = models.Conversation;
const mongoose = require('mongoose');


const GroupConversationController = {

  findGroupConversation (req, res, next) {
   //here we will be getting an object with {sender: 'Matt', recipiant: 'Ross', etc, etc??}
   // still have front end send sender object 
   const {sender, recipients} = req.body;
   //const participants = [{name: sender}];
   const participants = [];
   recipients.push(sender);
   recipients.sort()
   recipients.map((participant) => {
      participants.push({name: participant})
   });

   
   Conversation.findOne({ participants : participants }) //returns an array with all group convos user has
   .then(allGroupConvosWithSender => {
        console.log(allGroupConvosWithSender, 'ALL GROUP CONVOS')
        if (allGroupConvosWithSender) {
          res.locals.status = 200;
          res.locals.convoId = allGroupConvosWithSender._id;
          res.locals.messages = allGroupConvosWithSender.messages;
          return next();
        } else {
         Conversation.create({_id: mongoose.Types.ObjectId() , participants: participants, messages: []})
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

  getAllGroupConvosForAUser (req, res, next) {
    const { username } = req.body; 
    
    Conversation.find({participants: { name: username } })
    .then( (mongoResult) => {
      if (mongoResult.length === 0){
        res.locals.conversations = [];
        res.locals.status = 204;
        return next();
      } else {
        const conversations = [];
        mongoResult.forEach(convo => {
          if (convo.participants.length > 2) {
            conversations.push(convo);
          };
        });
        console.log(conversations, 'conversations fetched in database')
        res.locals.conversations = conversations;
        res.locals.status = 200;
        return next();
      }
    })
  }

}






module.exports = GroupConversationController;