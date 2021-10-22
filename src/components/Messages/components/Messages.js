import React, { useContext } from 'react';
import io from 'socket.io-client';
import useSound from 'use-sound';
import config from '../../../config';
import LatestMessagesContext from '../../../contexts/LatestMessages/LatestMessages';
import TypingMessage from './TypingMessage';
import Header from './Header';
import Footer from './Footer';
import Message from './Message';
import '../styles/_messages.scss';
import InitialBottyMessage from "../../../common/constants/initialBottyMessage";

const socket = io(
  config.BOT_SERVER_ENDPOINT,
  { transports: ['websocket', 'polling', 'flashsocket'] }
);

const message = InitialBottyMessage;

function scrollToBottomOfMessages() {
	const messageList = document.getElementById("message-list");
	messageList.scrollTo({ top: list.scrollHeight });
}

function Messages() {
  const [playSend] = useSound(config.SEND_AUDIO_URL);
  const [playReceive] = useSound(config.RECEIVE_AUDIO_URL);
  const { setLatestMessage } = useContext(LatestMessagesContext);
  const [message, setMessage] = useState();
	const [messages, setMessages] = useState(message);
	const [botTyping, setBotTyping] = useState(false);

  useEffect(() => {
    socket('bot-message', () => {
      setMessages([...messages, { message }]);      
      setMessage();
      setBotTyping();
      playSend();
      playReceive();
      setLatestMessage(message);
      scrollToBottomOfMessages();
    })
    socket('bot-typing', () => {
      setBotTyping(true);
    })
  });
  
  useCallback(() => {
		setMessage();
		setMessages([...messages, { message }]);
		playSend();
		scrollToBottomOfMessages();
  });
  
  return (
    <div className="messages">
      <Header />
      <div className="messages__list" id="message-list">
      </div>
      <Footer message={message} sendMessage={sendMessage} onChangeMessage={onChangeMessage} />
    </div>
  );
}

export default Messages;
