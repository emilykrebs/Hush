const models = require('./models'); //models.User //models.Conversation
const Conversation = models.Conversation;
const mongoose = require('mongoose');

const checker = (arr1, arr2) => {
  for (let i = 0; i < arr1.length; i += 1) {
    for (let key in arr1[i]) {
      if (arr1[i][key] !== arr2[i][key]) {
        return false;
      }
    }
  }
  return true;
}

const GroupConversationController = {

  findGroupConversation (req, res, next) {
   //here we will be getting an object with {sender: 'Matt', recipiant: 'Ross', etc, etc??}
   // still have front end send sender object 
   const {sender, recipients} = req.body;
   const participants = [{name: sender}];
   recipients.map((participant) => {
      participants.push({name: participant})
   })
   let result;
   
   Conversation.find({participants : {name: sender}}) //returns an array with all group convos user has
   .then(allGroupConvosWithSender => {
    
     if (allGroupConvosWithSender.length === 0){ //the sender has no convos with anyone
       Conversation.create({_id: mongoose.Types.ObjectId() , participants: participants, messages: []})
       .then( (mongoResult) => {
         //should return us back an obj = {_id: 24vergverb, participants: [], messages: []}
         res.locals.convoId = mongoResult._id;
         res.locals.status = 200;
         res.locals.messages = mongoResult.messages;
         console.log('created a convo on line 30')
         return next();
       })
     }

     for (let indivConvo = 0; indivConvo < allGroupConvosWithSender.length; indivConvo ++){
       
       for (let groupConvoParticipants = 0; groupConvoParticipants < allGroupConvosWithSender[indivConvo].participants.length; groupConvoParticipants ++){
          let currentParticipant = allGroupConvosWithSender[indivConvo].participants[groupConvoParticipants].name 
          // Save current recipient convo to local
          if (recipients[groupConvoParticipants] === currentParticipant) {
            result = allGroupConvosWithSender[indivConvo];
            res.locals.convoId = result._id
            res.locals.messages = result.messages;
            res.locals.status = 200;
            return next();
          }
       }
     }

     /*if we make it here, we have iterated thru all of our senders convos, and have not found a conversation
     where the recipient is there. */
     /* creat conveo */
     Conversation.create({_id: mongoose.Types.ObjectId() ,participants: participants, messages: []})
     .then( (mongoResult) => {
      res.locals.convoId = mongoResult._id
      res.locals.messages = mongoResult.messages;
      res.locals.status = 200;
      return next();
      })
    })
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
        res.locals.conversations = mongoResult;
        res.locals.status = 200;
        return next();
      }
    })
  }

}






module.exports = ConversationController;