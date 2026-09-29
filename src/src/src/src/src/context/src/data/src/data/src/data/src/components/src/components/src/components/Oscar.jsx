import { useEffect, useState } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import './Oscar.css';

/**
 * Oscar — AI Chess Tutor
 * states: idle | talking | thinking | happy | sad | hint | celebrating
 */
export default function Oscar({
  state = 'idle',
  message,
  autoSpeak = true,
  size = 'md',
  showRepeat = true,
}) {
  const { speak, stop, speaking } = useSpeech();
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [lastMessage, setLastMessage] = useState(message);

  useEffect(() => {
    if (!message) return;
    setLastMessage(message);
    setBubbleVisible(true);
    if (autoSpeak) speak(message);
    return () => stop();
  }, [message, autoSpeak, speak, stop]);

  const handleRepeat = () => {
    if (lastMessage) speak(lastMessage);
  };

  const face = {
    idle: '🙂',
    talking: '🗣️',
    thinking: '🤔',
    happy: '😄',
    sad: '😟',
    hint: '💡',
    celebrating: '🎉',
  }[state] || '🙂';

  return (
    <div className={`oscar oscar-${size} oscar-${state}`}>
      <div className="oscar-avatar-wrap">
        {bubbleVisible && lastMessage && (
          <div className="speech-bubble">
            <div className="speech-bubble-text">{lastMessage}</div>
            <div className="speech-actions">
              {showRepeat && (
                <button className="bubble-btn" onClick={handleRepeat} title="फिर से सुनें">
                  🔊 {speaking ? 'बोल रहा है...' : 'Repeat'}
                </button>
              )}
              {speaking && (
                <button className="bubble-btn" onClick={stop} title="रोकें">
                  ⏸
                </button>
              )}
            </div>
          </div>
        )}
        <div className={`oscar-avatar ${state === 'talking' || speaking ? 'bounce' : ''}`}>
          <div className="oscar-head">
            <div className="oscar-face">{face}</div>
          </div>
          <div className="oscar-body">
            <span className="oscar-badge">♟️</span>
          </div>
        </div>
      </div>
      <div className="oscar-name">Oscar</div>
    </div>
  );
}
