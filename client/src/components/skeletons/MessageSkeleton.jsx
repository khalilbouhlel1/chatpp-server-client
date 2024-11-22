const MessageSkeleton = () => {
    // Create an array with unique IDs for skeleton messages
    const skeletonMessages = Array(6).fill(null).map((_, i) => `skeleton-msg-${i}`);
  
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {skeletonMessages.map((id) => (
          <div key={id} className={`chat ${id.endsWith('0') || id.endsWith('2') || id.endsWith('4') ? "chat-start" : "chat-end"}`}>
            <div className="chat-image avatar">
              <div className="size-10 rounded-full">
                <div className="skeleton w-full h-full rounded-full" />
              </div>
            </div>
  
            <div className="chat-header mb-1">
              <div className="skeleton h-4 w-16" />
            </div>
  
            <div className="chat-bubble bg-transparent p-0">
              <div className="skeleton h-16 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default MessageSkeleton;