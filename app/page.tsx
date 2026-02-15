"use client";

import { Fragment, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Send, Loader2, Sparkles, Phone, MapPin, Calendar } from "lucide-react";

const SUGGESTED_PROMPTS = [
  "Show me pricing and packages",
  "I want to book a birthday party",
  "What attractions do you have?",
  "Where are your locations?",
  "Tell me about corporate events",
  "What are your operating hours?",
];

export default function SkyJumperChat() {
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
    <div className="flex h-screen flex-col bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header - Orange Theme */}
      <div className="border-b border-orange-100 bg-white shadow-md">
        <div className="mx-auto max-w-5xl px-3 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Logo */}
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                <div className="text-lg sm:text-xl font-bold text-white">SJ</div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  SkyJumper
                </h1>
                <p className="text-[10px] sm:text-xs text-orange-600 font-medium">
                  India's #1 Trampoline Park • 23+ Centers
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <a 
                href="tel:08071820447" 
                className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-white font-medium shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">08071820447</span>
                <span className="sm:hidden">Call</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-3 py-4 sm:px-6 sm:py-6">
          {/* Welcome State */}
          {showWelcome && (
            <div className="flex min-h-[65vh] flex-col items-center justify-center text-center">
              {/* Logo */}
              <div className="mb-4 sm:mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 blur-2xl opacity-30 rounded-full"></div>
                <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-2xl">
                  <div className="text-2xl sm:text-3xl font-bold text-white">SJ</div>
                </div>
              </div>

              {/* Title */}
              <h1 className="mb-2 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                Welcome to <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">SkyJumper!</span>
              </h1>
              <p className="mb-2 sm:mb-3 max-w-xl px-4 text-base sm:text-lg md:text-xl text-orange-600 font-semibold">
                India's largest trampoline park chain
              </p>
              <p className="mb-6 sm:mb-8 max-w-md px-4 text-sm sm:text-base text-gray-600">
                Your AI assistant for instant bookings, info & more
              </p>
              
              {/* Suggested Prompts */}
              <div className="w-full max-w-4xl px-4">
                <div className="mb-3 sm:mb-4 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                  <span className="font-medium">Try asking about</span>
                </div>
                <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {SUGGESTED_PROMPTS.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedPrompt(prompt)}
                      className="group relative overflow-hidden rounded-xl border-2 border-orange-200 bg-white px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-700 transition-all hover:border-orange-400 hover:shadow-xl active:scale-95"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 opacity-0 transition-opacity group-hover:opacity-100"></div>
                      <span className="relative flex items-center gap-2">
                        <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                        {prompt}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-6 rounded-2xl bg-white border-2 border-orange-100 p-4 sm:p-6 shadow-xl max-w-md w-full mx-4">
                <div className="text-center">
                  <div className="mb-1 text-2xl sm:text-3xl font-bold bg-gradient-to-br from-orange-600 to-orange-500 bg-clip-text text-transparent">23+</div>
                  <div className="text-[10px] sm:text-xs text-gray-600 font-medium">Centers</div>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-2xl sm:text-3xl font-bold bg-gradient-to-br from-orange-600 to-orange-500 bg-clip-text text-transparent">18+</div>
                  <div className="text-[10px] sm:text-xs text-gray-600 font-medium">Cities</div>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-2xl sm:text-3xl font-bold bg-gradient-to-br from-orange-600 to-orange-500 bg-clip-text text-transparent">50+</div>
                  <div className="text-[10px] sm:text-xs text-gray-600 font-medium">Attractions</div>
                </div>
              </div>

              {/* Features */}
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-orange-100 shadow-sm">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                  <span>Pan India</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-orange-100 shadow-sm">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                  <span>Easy Booking</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-orange-100 shadow-sm">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                  <span>Instant Replies</span>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {!showWelcome && (
            <div className="space-y-4 sm:space-y-6">
              {messages.map((message) => (
                <div key={message.id}>
                  {message.parts.map((part, i) => {
                    if (part.type !== "text") return null;
                    
                    return (
                      <Fragment key={`${message.id}-${i}`}>
                        <div className="flex items-start gap-2 sm:gap-3">
                          {/* Avatar */}
                          <div className={`
                            flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-xl shadow-lg
                            ${message.role === "assistant" 
                              ? "bg-gradient-to-br from-orange-500 to-orange-600" 
                              : "bg-gradient-to-br from-gray-600 to-gray-700"
                            }
                          `}>
                            {message.role === "assistant" ? (
                              <div className="text-xs sm:text-sm font-bold text-white">SJ</div>
                            ) : (
                              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>

                          {/* Message */}
                          <div className="flex-1 space-y-1 min-w-0">
                            <div className="text-[10px] sm:text-xs font-semibold text-gray-600">
                              {message.role === "assistant" ? "SkyJumper Assistant" : "You"}
                            </div>
                            <div className={`
                              rounded-2xl px-3 py-3 sm:px-4 sm:py-4 text-xs sm:text-sm md:text-base shadow-md
                              ${message.role === "assistant" 
                                ? "bg-white border-2 border-orange-100" 
                                : "bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200"
                              }
                            `}>
                              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed break-words">
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
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                    <div className="text-xs sm:text-sm font-bold text-white">SJ</div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="text-[10px] sm:text-xs font-semibold text-gray-600">SkyJumper Assistant</div>
                    <div className="inline-flex items-center gap-2 sm:gap-3 rounded-2xl border-2 border-orange-100 bg-white px-3 py-3 sm:px-4 sm:py-4 shadow-md">
                      <div className="flex gap-1 sm:gap-1.5">
                        <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 animate-bounce rounded-full bg-gradient-to-r from-orange-500 to-orange-600 [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 animate-bounce rounded-full bg-gradient-to-r from-orange-500 to-orange-600 [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 animate-bounce rounded-full bg-gradient-to-r from-orange-500 to-orange-600"></div>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="border-t border-orange-100 bg-white shadow-lg">
        <div className="mx-auto max-w-5xl px-3 py-3 sm:px-6 sm:py-4">
          <form onSubmit={handleSubmit}>
            {/* Input Container */}
            <div className="flex items-end gap-2 rounded-2xl border-2 border-orange-200 bg-white p-2 shadow-md transition-all focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100">
              {/* Textarea */}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about pricing, bookings, locations, or anything else..."
                disabled={isLoading}
                rows={1}
                className="flex-1 resize-none border-0 bg-transparent px-2 py-2 sm:px-3 sm:py-3 text-xs sm:text-sm md:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 disabled:opacity-50"
                style={{
                  minHeight: "44px",
                  maxHeight: "120px",
                }}
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
            </div>

            {/* Helper Text */}
            <div className="mt-2 sm:mt-3 flex items-center justify-between px-1 text-[10px] sm:text-xs">
              <span className="text-gray-500">
                Press <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono font-semibold border border-gray-200">Enter</kbd> to send
              </span>
              <span className="text-orange-600 font-medium flex items-center gap-1">
                <span className="animate-pulse">●</span>
                <span>Instant responses</span>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}