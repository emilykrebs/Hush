import { connect } from 'react-redux';
import Dashboard from '../components/Dashboard.jsx';
import { setActiveConversations, setActivesLoaded, logout, setActiveGroupConversations } from '../actions/actions';

/**
 * Maps dispatch to props & connects with Login component
 * Maps state from redux store to props - activeConversations & loggedIn
 */

const mapDispatchToProps = dispatch => ({
  setActiveConversations: (users) => {
    dispatch(setActiveConversations(users));
  },
  setActiveGroupConversations: (users) => {
    dispatch(setActiveGroupConversations(users));
  },
    logout: () => {
      dispatch(logout());
    }
});

export const Dashboard_Container = connect(state => ({
  activeConversations: state.user.activeConversations,
  activeGroupConversations: state.user.activeGroupConversations,
  loggedIn: state.user.loggedIn,
  email: state.user.email,
  activesLoaded: state.user.activesLoaded,
  activeRecipient: state.user.activeRecipient,
  clientSocket: state.user.clientSocket,
  username: state.user.username,
}), mapDispatchToProps)(Dashboard);