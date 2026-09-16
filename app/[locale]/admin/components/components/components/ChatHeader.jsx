export default function ChatHeader({ activeUser }) {
  return (
    <div className="admin-chat-header">
      <span className="admin-section-eyebrow">Inbox</span>
      <strong>{activeUser ? `Chat with ${activeUser.name}` : "Select a user"}</strong>
      <small>{activeUser ? "Private conversation with a guest" : "Choose a guest to view the conversation"}</small>
    </div>
  );
}
