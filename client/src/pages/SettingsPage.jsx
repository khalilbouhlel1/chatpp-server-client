import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Check, Search } from "lucide-react";
import { useState, useEffect } from "react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredThemes = THEMES.filter(t => 
    t.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="min-h-[calc(100vh-65px)] container mx-auto px-4 py-20 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Theme Selection */}
        <div className="bg-base-200 p-6 rounded-xl shadow-sm h-[calc(100vh-130px)] overflow-hidden flex flex-col">
          <div className="border-b border-base-300 pb-4 mb-4">
            <h2 className="text-2xl font-bold">Settings</h2>
            <p className="text-base-content/70 mt-1">Customize your chat experience</p>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search themes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50" size={20} />
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredThemes.map((t) => (
                <button
                  key={t}
                  className={`
                    relative group flex flex-col items-center gap-2 p-3 rounded-lg transition-all
                    ${theme === t ? "bg-base-300 ring-2 ring-primary" : "hover:bg-base-300"}
                  `}
                  onClick={() => setTheme(t)}
                  aria-label={`Select ${t} theme`}
                >
                  {theme === t && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-content p-1 rounded-full">
                      <Check size={12} />
                    </div>
                  )}
                  <div className="relative h-12 w-full rounded-md overflow-hidden" data-theme={t}>
                    <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                      <div className="rounded bg-primary"></div>
                      <div className="rounded bg-secondary"></div>
                      <div className="rounded bg-accent"></div>
                      <div className="rounded bg-neutral"></div>
                    </div>
                  </div>
                  <span className="text-xs font-medium capitalize">{t}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="bg-base-200 p-6 rounded-xl shadow-sm h-[calc(100vh-130px)] overflow-hidden flex flex-col">
          <div className="border-b border-base-300 pb-4 mb-4">
            <h3 className="text-lg font-semibold">Preview</h3>
            <p className="text-sm text-base-content/70">
              Currently using: <span className="font-medium text-primary capitalize">{theme}</span>
            </p>
          </div>

          <div className="flex-1 bg-base-100 rounded-xl overflow-hidden shadow-md flex flex-col" data-theme={theme}>
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-base-300">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-content">
                    <span className="text-sm">J</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-sm">John Doe</h3>
                  <p className="text-xs text-base-content/70">Online</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-[200px]">
              {PREVIEW_MESSAGES.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`
                      max-w-[80%] rounded-xl p-3
                      ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}
                    `}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-[10px] mt-1.5 ${
                      message.isSent ? "text-primary-content/70" : "text-base-content/70"
                    }`}>
                      12:00 PM
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-base-300 mt-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input input-bordered flex-1 text-sm h-10"
                  placeholder="Type a message..."
                  value="This is a preview"
                  readOnly
                />
                <button className="btn btn-primary h-10 min-h-0 px-3">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;