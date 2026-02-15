"use client";

import { Fragment, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Send, Loader2, Sparkles } from "lucide-react";

const SUGGESTED_PROMPTS = [
  "How to stay motivated during treatment",
  "How to support a patient with cancer",
  "Understanding chemotherapy side effects",
  "Nutrition tips during cancer treatment",
];

export default function Home() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    sendMessage({ text: input });
    setInput("");
  };

  const handleSuggestedPrompt = (promptText: string) => {
    sendMessage({ text: promptText });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const showWelcome = messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-gray-50">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          {/* Welcome State */}
          {showWelcome && (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg">
                <svg
                  className="h-10 w-10 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4V12M12 12V20M12 12H20M12 12H4"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                HopeBridge
              </h1>
              <p className="mb-8 max-w-md text-base text-gray-600 sm:text-lg">
                Your compassionate AI cancer information advisor
              </p>
              
              {/* Suggested Prompts */}
              <div className="w-full max-w-2xl">
                <div className="mb-3 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Sparkles className="h-4 w-4" />
                  <span>Try asking about</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {SUGGESTED_PROMPTS.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedPrompt(prompt)}
                      className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-700 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {!showWelcome && (
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id}>
                  {message.parts.map((part, i) => {
                    if (part.type !== "text") return null;
                    
                    return (
                      <Fragment key={`${message.id}-${i}`}>
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className={`
                            flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10
                            ${message.role === "assistant" 
                              ? "bg-indigo-600" 
                              : "bg-gray-400"
                            }
                          `}>
                            {message.role === "assistant" ? (
                              <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>

                          {/* Message */}
                          <div className="flex-1 space-y-1">
                            <div className="text-xs font-medium text-gray-500">
                              {message.role === "assistant" ? "HopeBridge" : "You"}
                            </div>
                            <div className={`
                              rounded-2xl px-4 py-3 text-sm sm:text-base
                              ${message.role === "assistant" 
                                ? "bg-white border border-gray-200" 
                                : "bg-gray-100 border border-gray-200"
                              }
                            `}>
                              <div className="whitespace-pre-wrap text-gray-800">
                                {part.text}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
              ))}

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 sm:h-10 sm:w-10">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="text-xs font-medium text-gray-500">HopeBridge</div>
                    <div className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-600 [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-600 [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-600"></div>
                      </div>
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <form onSubmit={handleSubmit}>
            {/* Input Container */}
            <div className="flex items-end gap-2 rounded-2xl border-2 border-gray-200 bg-white p-2 transition-all focus-within:border-indigo-400 focus-within:shadow-lg">
              {/* Textarea */}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about cancer information..."
                disabled={isLoading}
                rows={1}
                className="flex-1 resize-none border-0 bg-transparent px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 disabled:opacity-50 sm:text-base"
                style={{
                  minHeight: "44px",
                  maxHeight: "120px",
                }}
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition-all hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed sm:h-11 sm:w-11"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Helper Text */}
            <p className="mt-2 px-1 text-xs text-gray-500">
              Press <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">Enter</kbd> to send
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}