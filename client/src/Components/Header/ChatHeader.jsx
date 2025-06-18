import "./ChatHeader.css";

const ChatHeader = ({ category, onBack }) => {
  return (
    <div className="chat-header">
      <button className="back-button" onClick={onBack}>
        ←
      </button>
      <h2>{category.name}</h2>
      <span className="category-icon">{category.icon}</span>
    </div>
  );
};

export default ChatHeader;
