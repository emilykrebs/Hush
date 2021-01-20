import React, { useState } from 'react';
import styled from 'styled-components';

/**
 * Renders active conversations to sidepanel
 */

const Conversations = ({ setActiveChat, activeConversations, setActiveConversations, email, 
                        activeGroupConversations, setActiveGroupConversations }) => {

  /**
   * Set state
   * directOpen determines whether to expand or hide active direct messages - passed as prop to styled component and changes display based on value
   * groupOpen  determines whether to expand or hide active group messages - passed as prop to styled component and changes display based on value
   */
  const [directOpen, setDirectOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [newGroup, setNewGroup] = useState(false);
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
        console.log(response.conversations, 'BASIC RESPONSE')
        const allActiveConvos = response.conversations.map(convo => convo.participants.filter(user => user.name !== email));
        const filteredActiveConvos = [];
        console.log('ALL ACTIVE CONVOS', allActiveConvos)
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
    }
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
        console.log(response.conversations, 'BASIC RESPONSE')
        const allGroupActiveConvos = response.conversations.map(convo => convo.participants.filter(user => user.name !== email));
        const filteredGroupActiveConvos = [];
        allGroupActiveConvos.forEach(convo => {
          if (!filteredGroupActiveConvos.includes(convo[0].name) && convo[0].name) {
            filteredGroupActiveConvos.push(convo[0].name);
          }
        });
        setActiveGroupConversations(filteredGroupActiveConvos);   
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
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: email,
        recipient: e.target.innerText
      })
    };
    console.log('HANDLE GROUP USER CLICK')
  }

  const handleNewGroupClick = (e) => {
    if (newGroup) setNewGroup(false);
    else setNewGroup(true);
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
          {activeGroupConversations.map((user, i) => (
            <Group
            key={`${user}${i}`}
            email={user}
            onClick={(e) => handleGroupUserClick(e)}
            >
            </Group>
          ))}
        </InnerList>
        <li>
          <NewGroup onClick={(e) => handleNewGroupClick(e)}>
             New Group Chat
          </NewGroup>
        </li>
        <InnerList open={newGroup}>
          <input type='text' placeholder='Search users...'  width='70%'/>
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
  height: 65%;
  margin-top: -1rem;
  z-index: 2;
  font-family: 'Josefin Sans', sans-serif;
  overflow: hidden;
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

const NewGroup = styled(DirectCaret)`

`;

const Header = styled.h3`
  height: fit-content;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 400;
`;

const GroupChat = styled.li`
  z-index: 0;
  cursor: pointer;
  user-select: none;

  &:before {
    font-family: times-new-roman;
    content: "\\005E";
    color: black;
    display: inline-block;
    padding: .5rem;
  }
`;