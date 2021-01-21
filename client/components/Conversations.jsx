import React, { useState } from 'react';
import styled from 'styled-components';
import GroupSearchBar from './GroupSearchBar.jsx';

/**
 * Renders active conversations to sidepanel
 */

const Conversations = ({ setActiveChat, activeConversations, setActiveConversations, email, 
                        activeGroupConversations, setActiveGroupConversations, activeChat, open, handleClick }) => {

  /**
   * Set state
   * directOpen determines whether to expand or hide active direct messages - passed as prop to styled component and changes display based on value
   * groupOpen  determines whether to expand or hide active group messages - passed as prop to styled component and changes display based on value
   */
  const [directOpen, setDirectOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [conversationSelected, setConversationSelected] = useState(false);
 

  // Handles click of direct caret &
  // Make request for all active conversations

  const handleDirectClick = (e) => {
    if (directOpen) setDirectOpen(false);
    else {
      setDirectOpen(true);

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email })
      };

      // update list of users who have an active conversation with logged-in user
      // conversation list query returns both users attached to a conversation
      // filter out user name of logged in user to display only recipient email

      fetch('/chat/userconvos', requestOptions)
      .then(res => res.json())
      .then(response => {
        const allActiveConvos = response.conversations.map(convo => convo.participants.filter(user => user.name !== email));
        const filteredActiveConvos = [];
        allActiveConvos.forEach(convo => {
          if (!filteredActiveConvos.includes(convo[0].name) && convo[0].name) {
            filteredActiveConvos.push(convo[0].name);
          }
        });
        setActiveConversations(filteredActiveConvos);   
      })
      .catch(err => {
        console.log(`There was an error: ${err}`)
      })
    };
  };

  // Handles click of group caret &
  // Make request for all active  GROUP conversations

  const handleGroupClick = (e) => {
    if (groupOpen) setGroupOpen(false);
    else {
      setGroupOpen(true)

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email })
      };

      fetch('/groupchat/groupuserconvos', requestOptions)
      .then(res => res.json())
      .then(response => {
        const filteredParticipants = response.conversations.map(convo => convo.participants.filter(person => person.name !== email))
        const filteredEmails = filteredParticipants.map(convo => convo.map(person => person = person.name).join(' '))
        setActiveGroupConversations(filteredEmails)
        })
      .catch(err => {
        console.log(`There was an error: ${err}`)
      })
    };
  };

  // request chat log info for selected user

  const handleUserClick = (e) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: email,
        recipient: e.target.innerText
      })
    };

    /**
     * immediately invoked Async function
     * makes request to server for conversation object using username
     */

    try {
      (async () => {
        const request = await fetch('/chat/convo', requestOptions);
        const response = await request.json();
        console.log
        // setActiveChat action updates state with currently selected user chat log
        setActiveChat({ response: response, recipient: e.target.innerText });
      })();
    } catch (err) {
      console.log(err);
    }
  };

  const handleGroupUserClick = (e) => {
    const recipients = e.target.innerText.split(' ')

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: email,
        recipients: recipients
      })
    };

    fetch('/groupchat/groupconvo', requestOptions)
    .then(res => res.json())
    .then(response => {
      setActiveChat({ response: response, recipient: recipients})
    })
   .catch(err => {
     console.log(`Error in Conversations:HandleGroupClick: ${err}`)
   })    
  }


  return (
    <Container>
      <Header>Conversations</Header>
      <Ul>
        <li>
          <DirectCaret
            onClick={(e) => handleDirectClick(e)}
            open={directOpen}
          >
            Direct
          </DirectCaret>
          <InnerList open={directOpen} >
            {activeConversations.map((user, i) => (
              <Direct
                key={`${user}${i}`}
                email={user}
                onClick={(e) => handleUserClick(e)}
              >
                {user}
              </Direct>
            ))}
          </InnerList>
        </li>
        <li>
          <GroupCaret
            onClick={(e) => handleGroupClick(e)}
            open={groupOpen}
          >
            Groups
          </GroupCaret>
        </li>
        <InnerList open={groupOpen} >
          {activeGroupConversations.map((group, i) => (
            <Group 
              key={`${group}${i}`}
              email={group}
              onClick={(e) => handleGroupUserClick(e)}
            >
              {group}
            </Group>
          ))}
        </InnerList>
      </Ul>
    </Container>
  );
};

export default Conversations;

/**
 * Styled Components
 */
const Container = styled.div`
  height: 40%;
  margin-top: -1rem;
  z-index: 2;
  font-family: 'Josefin Sans', sans-serif;
  overflow: scroll;
`;
const Ul = styled.ul`
  height: fit-content;
  list-style-type: none;
  margin-left: 2rem;
`;

const DirectCaret = styled.span`
  z-index: 0;
  cursor: pointer;
  user-select: none;

  &:before {
    font-family: times-new-roman;
    content: "\\005E";
    color: black;
    display: inline-block;
    padding: .5rem;
    transform: ${props => props.open ? 'rotate(180deg)' : 'rotate(90deg)'}; 
  };
`;

const GroupCaret = styled(DirectCaret)`
  &:before {
    transform: ${props => props.open ? 'rotate(180deg)' : 'rotate(90deg)'};
  }
`;

const Direct = styled.li`
  
  text-indent: 1rem;
  padding: .5rem;
  margin-left: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #fcf7fa;
    
  }
`;

const InnerList = styled.ul`
  list-style-type: none;
  display: ${props => props.open ? 'initial' : 'none'};
`;

const Group = styled(Direct)`

`;

const Header = styled.h3`
  height: fit-content;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 400;
`;
