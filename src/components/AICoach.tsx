import React, { useState, useRef, useEffect } from "react";
import { useStore } from "../store";
import { Sparkles, Send, Bot, User, Trash2, ArrowRightLeft, ShieldAlert } from "lucide-react";

interface ChatMessage {
  sender: "user" | "coach";
  text: string;
  timestamp: string;
}

export default function AICoach() {
  const { tasks, learningSkills, jobApplications, gainXP } = useStore();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "coach",
      text: "Hello Ajay! I am your SDE Career OS Coach. I have analyzed your active profile, high-priority learning paths, and application pipeline. How can I help you level-up your coding credentials today?",
      timestamp: "14:00"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendQuery = async (queryStr: string) => {
    if (!queryStr.trim()) return;

    // Append User Message
    const timestampStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = {
      sender: "user",
      text: queryStr,
      timestamp: timestampStr
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      // Fetch recommendation from `/api/coach`
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: queryStr,
          context: {
            tasks,
            learningSkills,
            jobApplications
          }
        })
      });

      if (!response.ok) {
        throw new Error("Could not contact the SDE AI Coach server.");
      }

      const data = await response.json();
      const aiReply: ChatMessage = {
        sender: "coach",
        text: data.reply || "I encountered an error formulating a plan. Try again shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, aiReply]);
      gainXP(75); // award XP for seeking professional consulting!
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        sender: "coach",
        text: "My apologies. I'm having trouble proxying to Gemini AI right now. Please verify your internet connection or try again later.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Design a study roadmap for Azure AI Search",
    "How should I optimize my Resume for SDE2 roles?",
    "Give me 3 tough behavioral questions for Vercel SDE",
    "Synthesize my active tasks into a daily timeline"
  ];

  return (
    <div id="ai-coach-view" className="flex-1 flex flex-col bg-[#09090b] text-[#fafafa] h-full max-h-[calc(100vh-64px)]">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-[#1f1f23] p-5 shrink-0 bg-[#09090b]">
        <div>
          <h2 className="font-sans font-bold text-xl tracking-tight text-[#fafafa] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
            <span>AI Career Coach</span>
          </h2>
          <p className="text-xs text-[#71717a] font-mono mt-0.5">
            Gemini SDE advice engine synchronized directly with your PathForge database
          </p>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                sender: "coach",
                text: "Hello Ajay! I'm ready. What skills or interview prep are we mastering next?",
                timestamp: "14:00"
              }
            ]);
          }}
          className="p-1.5 text-[#71717a] hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Logs Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[300px]">
        {messages.map((msg, index) => {
          const isCoach = msg.sender === "coach";

          return (
            <div key={index} className={`flex gap-3.5 max-w-3xl ${isCoach ? "mr-auto" : "ml-auto flex-row-reverse"}`}>
              {/* Profile icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                isCoach ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-[#18181b] border-[#1f1f23] text-[#fafafa]"
              }`}>
                {isCoach ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
              </div>

              {/* Message box */}
              <div className={`p-4 rounded-xl border text-xs leading-relaxed font-sans ${
                isCoach
                  ? "bg-[#0c0c0e] border-[#1f1f23] text-slate-200"
                  : "bg-blue-500/10 border-blue-500/30 text-[#fafafa]"
              }`}>
                {/* Parse lines beautifully */}
                <div className="space-y-1 whitespace-pre-wrap">
                  {msg.text.split("\n").map((line, lIdx) => {
                    if (line.startsWith("-") || line.startsWith("*")) {
                      return (
                        <li key={lIdx} className="list-disc ml-4 text-slate-300">
                          {line.substring(1).trim()}
                        </li>
                      );
                    }
                    return <p key={lIdx}>{line}</p>;
                  })}
                </div>
                <span className="text-[9px] font-mono text-[#71717a] block text-right mt-2">{msg.timestamp}</span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3.5 mr-auto">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Bot className="w-4.5 h-4.5 animate-bounce" />
            </div>
            <div className="bg-[#0c0c0e]/40 border border-[#1f1f23] p-4 rounded-xl text-xs font-mono text-blue-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span>AI Coach is compiling career data structures...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Quick Chips */}
      <div className="px-6 py-2.5 bg-[#09090b] border-t border-[#1f1f23] shrink-0">
        <span className="text-[9px] font-mono text-[#71717a] uppercase font-bold tracking-wider block mb-2">
          Recommended Consultations
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(promptText)}
              className="px-3 py-1.5 rounded-xl text-xs text-[#fafafa] bg-[#0c0c0e] hover:bg-[#18181b] hover:text-blue-400 border border-[#1f1f23] hover:border-[#27272a] transition-all font-sans cursor-pointer text-left"
            >
              {promptText}
            </button>
          ))}
        </div>
      </div>

      {/* Input query form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuery(inputText);
        }}
        className="p-5 bg-[#09090b] border-t border-[#1f1f23] shrink-0 flex gap-2"
      >
        <input
          type="text"
          placeholder="Ask SDE Career OS Coach about algorithms, system design, or interview preparation..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-[#0c0c0e] border border-[#1f1f23] hover:border-[#27272a] focus:border-blue-500 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-5 py-3.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-all shadow"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
