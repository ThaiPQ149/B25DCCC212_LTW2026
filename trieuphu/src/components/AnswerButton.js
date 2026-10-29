const AnswerButton = ({ letter, text, state, disabled, hidden, onClick }) => (
  <button
    className={`answer ${state}${hidden ? ' hidden' : ''}`}
    disabled={disabled || hidden}
    onClick={onClick}
  >
    {hidden ? '' : `${letter}. ${text}`}
  </button>
);

export default AnswerButton;