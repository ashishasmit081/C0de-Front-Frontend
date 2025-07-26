import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef, useEffect, memo } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { addMessage, setTyping } from '../chatSlice';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

// ✅ Memoized Chat Bubble Component
const ChatBubble = memo(function ChatBubble({ text, isUser, darkMode }) {
  const bubbleClass = isUser
    ? darkMode ? 'bg-blue-600/30 text-white' : 'bg-blue-300 text-black'
    : darkMode ? 'bg-gray-600 text-white' : 'bg-gray-100 text-black';

  return (
    <div className={`chat w-full ${isUser ? 'chat-end' : 'chat-start'} z-10`}>
      <div className={`chat-bubble max-w-xs md:max-w-md lg:max-w-lg break-words ${bubbleClass}`}>
        {/* For UI for code blocks , bold text and ... */}
        <ReactMarkdown
            children={text}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
                p: ({ node, ...props }) => (
                <p className="prose max-w-full dark:prose-invert" {...props} />
                ),
                code: ({ inline, children, className, ...props }) => {
                if (inline) {
                    return (
                    <code
                        className={`rounded px-1 py-0.5 text-sm ${
                        darkMode
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-200 text-black'
                        }`}
                        {...props}
                    >
                        {children}
                    </code>
                    );
                }

                return (
                    <pre
                    className={`rounded-lg p-4 overflow-x-auto my-2 ${
                        darkMode
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-black'
                    }`}
                    >
                    <code className="text-sm" {...props}>
                        {children}
                    </code>
                    </pre>
                );
                }
            }}
        />


      </div>
    </div>
  );
});

// ✅ Typing Effect Component
const TypingEffect = memo(function TypingEffect({ text, speed = 25, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[i]);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <ReactMarkdown
      children={displayedText}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        p: ({ node, ...props }) => (
          <p className="prose max-w-full dark:prose-invert" {...props} />
        ),
        code: ({ node, inline, className, children, ...props }) => (
          <code
            className={`rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-sm ${
              inline ? 'inline' : 'block overflow-x-auto'
            }`}
            {...props}
          >
            {children}
          </code>
        ),
        pre: ({ node, ...props }) => (
          <pre
            className="rounded-lg bg-gray-100 dark:bg-gray-900 p-4 overflow-x-auto my-2"
            {...props}
          />
        )
      }}
    />
  );
});

function AIChatbot({ problem }) {
  const darkMode = useSelector((state) => state.auth.darkMode);
  const messages = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();
  const [pendingModelMessage, setPendingModelMessage] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const messagesEndRef = useRef(null);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = async (data) => {
    const newUserMessage = { role: 'user', parts: [{ text: data.message }] };
    dispatch(addMessage(newUserMessage));
    reset();

    try {
      dispatch(setTyping(true));

      const response = await axiosClient.post("/ai/chat", {
        message: messages.concat(newUserMessage),
        title: problem.title,
        description: problem.description,
        testCases: [problem.visibleTestCases, problem.hiddenTestCases],
        startCode: problem.startCode
      });

      setPendingModelMessage({
        role: 'model',
        parts: [{ text: response.data }]
      });
    } catch (error) {
      console.error("API Error:", error);
      dispatch(addMessage({
        role: 'model',
        parts: [{ text: "Sorry, I encountered an error!" }]
      }));
      dispatch(setTyping(false));
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-[75vh] min-h-[500px]">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <ChatBubble
            key={index}
            text={msg.parts[0]?.text || ""}
            isUser={msg.role === 'user'}
            darkMode={darkMode}
          />
        ))}

        {/* Typing bubble */}
        {pendingModelMessage && (
          <div className="chat w-full chat-start">
            <div className={`chat-bubble max-w-xs md:max-w-md lg:max-w-lg break-words ${
              darkMode ? 'bg-gray-600 text-white' : 'bg-gray-100 text-black'
            }`}>
              <TypingEffect
                text={pendingModelMessage.parts[0].text}
                onComplete={() => {
                  dispatch(addMessage(pendingModelMessage));
                  setPendingModelMessage(null);
                  dispatch(setTyping(false));
                }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-auto mb-2 flex justify-center px-2"
      >
        <div className={`flex items-end gap-3 px-5 py-4 rounded-2xl shadow-md border max-w-xl w-full ${
          darkMode
            ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black border-gray-700 text-white'
            : 'bg-gradient-to-br from-blue-100 via-white to-blue-100 border-gray-300 text-black'
        }`}>
          <textarea
            placeholder="Ask me anything"
            {...register("message", { required: true, minLength: 2 })}
            className={`input resize-none h-[400px] max-h-[60px] text-wrap overflow-auto input-md w-full focus:outline-none focus:ring-2 focus:ring-primary rounded-xl transition-all duration-200
              ${darkMode
                ? 'bg-gray-800 text-white placeholder-gray-400 border-gray-600'
                : 'bg-white text-black placeholder-gray-500 border-gray-300'}`}
          />
          <button
            type="submit"
            disabled={errors.message}
            className={`btn btn-md rounded-xl font-semibold transition-colors duration-200
              ${darkMode
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none hover:from-purple-600 hover:to-yellow-400'
                : 'bg-blue-500 hover:bg-blue-600 text-white border-none'}`}
          >
            🚀Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default AIChatbot;
