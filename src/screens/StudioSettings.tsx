import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Database, Sliders, Bell, Shield, Save, User, Volume2, Globe, Sun, Moon, Check } from 'lucide-react';

interface StudioSettingsProps {
  onShowToast: (title: string, message: string, type: 'success' | 'info') => void;
  founderName?: string;
  onUpdateFounderName?: (name: string) => void;
  theme?: 'dark' | 'light';
  onSetTheme?: (theme: 'dark' | 'light') => void;
}

export const StudioSettings: React.FC<StudioSettingsProps> = ({
  onShowToast,
  founderName = 'Alex Vance',
  onUpdateFounderName,
  theme = 'dark',
  onSetTheme,
}) => {
  const [name, setName] = useState(founderName);
  const [specialty, setSpecialty] = useState('Full-Stack Web Optimization Specialist');
  const [toneStrictness, setToneStrictness] = useState<number>(95);
  const [intentThreshold, setIntentThreshold] = useState<number>(85);
  const [sprintTime, setSprintTime] = useState<string>('09:00');
  const [autoSprint, setAutoSprint] = useState<boolean>(true);
  const [desktopNotifs, setDesktopNotifs] = useState<boolean>(true);
  const [soundAlerts, setSoundAlerts] = useState<boolean>(true);
  const [dailyReminder, setDailyReminder] = useState<boolean>(true);

  const [channels, setChannels] = useState({
    twitter: true,
    bluesky: true,
    github: true,
    database: true
  });

  const handleSave = () => {
    if (onUpdateFounderName) {
      onUpdateFounderName(name);
    }
    onShowToast('Settings Saved', 'Your preferences and daily routine have been updated.', 'success');
  };

  const renderToggle = (checked: boolean, onChange: (val: boolean) => void) => (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none flex items-center cursor-pointer ${
        checked ? 'bg-[#D2F83D]' : 'bg-[#2E313A]'
      }`}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`w-5 h-5 rounded-full shadow-md ${
          checked ? 'bg-[#18191D] ml-auto' : 'bg-white mr-auto'
        }`}
      />
    </motion.button>
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#18191D] p-6 text-white select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Settings</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#202227] border border-[#2E313A] text-[#9CA3AF] font-normal">
              Stored Locally
            </span>
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Configure your professional profile, connected accounts, writing style, and notification preferences.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-1.5 bg-[#D2F83D] hover:bg-[#C2E82D] text-[#18191D] rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1">
        {/* 1. Profile & Professional Identity */}
        <div className="bg-[#202227] border border-[#2E313A] rounded-xl p-5 hover:border-[#3E424E] transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-[#3B66F5]" />
            <h3 className="text-sm font-bold text-white tracking-tight">Profile &amp; Positioning</h3>
          </div>
          <p className="text-xs text-[#9CA3AF] mb-4">
            Used to personalize your outreach messages and daily marketing updates.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#8A8F9E] mb-1.5">
                Your Name / Studio Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#18191D] border border-[#2E313A] rounded-lg px-3 py-2 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D2F83D] transition-colors"
                placeholder="e.g. Alex Vance"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8A8F9E] mb-1.5">
                Specialty / Offer
              </label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full bg-[#18191D] border border-[#2E313A] rounded-lg px-3 py-2 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D2F83D] transition-colors"
                placeholder="e.g. Next.js Performance & Mobile Portal Specialist"
              />
            </div>
          </div>
        </div>

        {/* 2. Appearance & Interface Theme (Apple HIG Standard) */}
        <div className="bg-[#202227] border border-[#2E313A] rounded-xl p-5 hover:border-[#3E424E] transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <Sun className="w-4 h-4 text-[#D2F83D]" />
            <h3 className="text-sm font-bold text-white tracking-tight">Appearance &amp; Theme</h3>
          </div>
          <p className="text-xs text-[#9CA3AF] mb-4">
            Select your preferred interface appearance. Both themes are calibrated to Apple HIG standards.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {/* Dark Theme Card */}
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onSetTheme?.('dark');
                onShowToast('Dark Appearance Active', 'Obsidian dark theme enabled.', 'info');
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                theme === 'dark'
                  ? 'bg-[#18191D] border-[#D2F83D] shadow-lg shadow-[#D2F83D]/5 ring-1 ring-[#D2F83D]/30'
                  : 'bg-[#18191D]/60 border-[#2E313A] hover:border-[#3E424E]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#202227] border border-[#2E313A] flex items-center justify-center text-white">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Dark Appearance</div>
                    <div className="text-xs text-[#9CA3AF]">Obsidian Slate</div>
                  </div>
                </div>
                {theme === 'dark' && (
                  <span className="w-5 h-5 rounded-full bg-[#D2F83D] text-[#18191D] flex items-center justify-center font-bold text-xs shadow-sm">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <div className="h-10 w-full rounded-lg bg-[#18191D] border border-[#2E313A] p-2 flex items-center gap-2 dark-preview-box">
                <div className="w-5 h-5 rounded bg-[#202227] border border-[#2E313A] dark-preview-item" />
                <div className="h-2 w-16 rounded bg-[#2E313A] dark-preview-item" />
                <div className="h-2 w-8 rounded bg-[#D2F83D] ml-auto" />
              </div>
            </motion.div>

            {/* Light Theme Card */}
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onSetTheme?.('light');
                onShowToast('Light Appearance Active', 'Silver clean light theme enabled.', 'info');
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                theme === 'light'
                  ? 'bg-[#F3F4F6] border-[#3B66F5] shadow-lg shadow-[#3B66F5]/10 ring-1 ring-[#3B66F5]/30'
                  : 'bg-[#18191D]/60 border-[#2E313A] hover:border-[#3E424E]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#111827]">
                    <Sun className="w-4 h-4 text-[#D97706]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Light Appearance</div>
                    <div className="text-xs text-[#9CA3AF]">Silver Daylight</div>
                  </div>
                </div>
                {theme === 'light' && (
                  <span className="w-5 h-5 rounded-full bg-[#3B66F5] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <div className="h-10 w-full rounded-lg bg-white border border-[#E5E7EB] p-2 flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-[#F3F4F6] border border-[#E5E7EB]" />
                <div className="h-2 w-16 rounded bg-[#D1D5DB]" />
                <div className="h-2 w-8 rounded bg-[#3B66F5] ml-auto" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* 2. Notifications & Alerts (Apple Style) */}
        <div className="bg-[#202227] border border-[#2E313A] rounded-xl p-5 hover:border-[#3E424E] transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-4 h-4 text-[#D2F83D]" />
            <h3 className="text-sm font-bold text-white tracking-tight">Notifications &amp; Alerts</h3>
          </div>
          <p className="text-xs text-[#9CA3AF] mb-4">
            Stay informed when high-fit client opportunities appear or scheduled tasks need your sign-off.
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-[#18191D] border border-[#2E313A] rounded-xl">
              <div>
                <div className="text-xs font-bold text-white">Client Opportunity Alerts</div>
                <div className="text-xs text-[#9CA3AF] mt-0.5">
                  Show banner alerts when a client post matches your exact services and budget criteria.
                </div>
              </div>
              {renderToggle(desktopNotifs, setDesktopNotifs)}
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#18191D] border border-[#2E313A] rounded-xl">
              <div>
                <div className="text-xs font-bold text-white">Morning Routine Reminder</div>
                <div className="text-xs text-[#9CA3AF] mt-0.5">
                  Notify you at {sprintTime} when today's draft post and client messages are ready.
                </div>
              </div>
              {renderToggle(dailyReminder, setDailyReminder)}
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#18191D] border border-[#2E313A] rounded-xl">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-[#8A8F9E]" />
                <div>
                  <div className="text-xs font-bold text-white">Subtle Sound Effects</div>
                  <div className="text-xs text-[#9CA3AF] mt-0.5">
                    Play a gentle chime when a high-relevance opportunity is detected.
                  </div>
                </div>
              </div>
              {renderToggle(soundAlerts, setSoundAlerts)}
            </div>
          </div>
        </div>

        {/* 3. Daily Morning Routine */}
        <div className="bg-[#202227] border border-[#2E313A] rounded-xl p-5 hover:border-[#3E424E] transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-[#34D399]" />
            <h3 className="text-sm font-bold text-white tracking-tight">Daily Morning Routine</h3>
          </div>
          <p className="text-xs text-[#9CA3AF] mb-4">
            Prepares your daily post and top 3 client opportunities so you can finish your marketing in 15 minutes.
          </p>

          <div className="flex items-center justify-between p-4 bg-[#18191D] border border-[#2E313A] rounded-xl">
            <div>
              <div className="text-xs font-bold text-white tracking-tight">Scheduled Preparation Time</div>
              <div className="text-xs text-[#9CA3AF] mt-0.5">
                Prepare 1 educational post and 3 personalized client messages every morning
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="time"
                value={sprintTime}
                onChange={(e) => setSprintTime(e.target.value)}
                className="bg-[#202227] border border-[#2E313A] text-white text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-[#D2F83D] cursor-pointer"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-white">Active</span>
                {renderToggle(autoSprint, setAutoSprint)}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Writing Voice & Style */}
        <div className="bg-[#202227] border border-[#2E313A] rounded-xl p-5 hover:border-[#3E424E] transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-4 h-4 text-[#D2F83D]" />
            <h3 className="text-sm font-bold text-white tracking-tight">Writing Voice &amp; Opportunity Filters</h3>
          </div>
          <p className="text-xs text-[#9CA3AF] mb-5">
            Keep your messages straightforward, helpful, and focused on real results.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {/* Tone Slider */}
            <div className="bg-[#18191D] border border-[#2E313A] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">Writing Style</span>
                <span className="text-xs font-bold text-[#D2F83D] bg-[#D2F83D]/10 px-2 py-0.5 rounded">
                  {toneStrictness}% Direct &amp; Natural
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF] leading-relaxed mb-4">
                Writes clearly for small business owners and busy founders. Never uses buzzwords, filler, or robotic jargon.
              </p>
              <input
                type="range"
                min="50"
                max="100"
                value={toneStrictness}
                onChange={(e) => setToneStrictness(Number(e.target.value))}
                className="w-full accent-[#D2F83D] cursor-pointer"
              />
              <div className="flex justify-between text-xs text-[#8A8F9E] mt-2 font-medium">
                <span>Conversational (50%)</span>
                <span>Balanced (75%)</span>
                <span>Direct &amp; Natural (100%)</span>
              </div>
            </div>

            {/* Opportunity Match Threshold Slider */}
            <div className="bg-[#18191D] border border-[#2E313A] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">Opportunity Matching</span>
                <span className="text-xs font-bold text-[#60A5FA] bg-[#3B66F5]/10 px-2 py-0.5 rounded">
                  {intentThreshold}% Relevance
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF] leading-relaxed mb-4">
                Filters incoming requests so you only spend time on serious prospects with real budgets and clear needs.
              </p>
              <input
                type="range"
                min="50"
                max="100"
                value={intentThreshold}
                onChange={(e) => setIntentThreshold(Number(e.target.value))}
                className="w-full accent-[#3B66F5] cursor-pointer"
              />
              <div className="flex justify-between text-xs text-[#8A8F9E] mt-2 font-medium">
                <span>All Inquiries (50%)</span>
                <span>High Fit (80%)</span>
                <span>Immediate Needs Only (95%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Connected Accounts */}
        <div className="bg-[#202227] border border-[#2E313A] rounded-xl p-5 hover:border-[#3E424E] transition-colors">
          <h3 className="text-sm font-bold text-white mb-1 tracking-tight">Connected Accounts</h3>
          <p className="text-xs text-[#9CA3AF] mb-4">
            Manage platforms where you share case studies and discover prospective clients.
          </p>

          <div className="grid grid-cols-4 gap-4">
            {/* Twitter / X */}
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              className="bg-[#18191D] border border-[#2E313A] rounded-xl p-4 flex flex-col justify-between hover:border-[#3E424E] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#202227] border border-[#2E313A] flex items-center justify-center">
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <span className="text-xs text-[#34D399] font-medium bg-[#10B981]/10 px-2.5 py-0.5 rounded-full">
                    Connected
                  </span>
                </div>
                <div className="text-sm font-bold text-white tracking-tight">X / Twitter</div>
                <div className="text-xs text-[#9CA3AF] mt-0.5">@alex_builder</div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#2E313A] flex items-center justify-between">
                <span className="text-xs text-[#9CA3AF]">Allow Sharing</span>
                {renderToggle(channels.twitter, (val) => setChannels({ ...channels, twitter: val }))}
              </div>
            </motion.div>

            {/* Bluesky */}
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              className="bg-[#18191D] border border-[#2E313A] rounded-xl p-4 flex flex-col justify-between hover:border-[#3E424E] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#202227] border border-[#2E313A] flex items-center justify-center">
                    <svg className="w-4 h-4 fill-[#3B66F5]" viewBox="0 0 24 24">
                      <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.382 5.65 1.04 7.625.658 1.975 2.586 3.12 4.417 3.12 1.83 0 2.87-.665 4.543-2.713 1.672 2.048 2.713 2.713 4.543 2.713 1.83 0 3.759-1.145 4.417-3.12.658-1.975 1.04-6.935 1.04-7.625 0-.688-.139-1.86-.902-2.203-.659-.299-1.664-.621-4.3 1.24C16.046 4.747 13.087 8.686 12 10.8z" />
                    </svg>
                  </div>
                  <span className="text-xs text-[#34D399] font-medium bg-[#10B981]/10 px-2.5 py-0.5 rounded-full">
                    Connected
                  </span>
                </div>
                <div className="text-sm font-bold text-white tracking-tight">Bluesky Social</div>
                <div className="text-xs text-[#9CA3AF] mt-0.5">alex.bsky.social</div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#2E313A] flex items-center justify-between">
                <span className="text-xs text-[#9CA3AF]">Allow Sharing</span>
                {renderToggle(channels.bluesky, (val) => setChannels({ ...channels, bluesky: val }))}
              </div>
            </motion.div>

            {/* GitHub */}
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              className="bg-[#18191D] border border-[#2E313A] rounded-xl p-4 flex flex-col justify-between hover:border-[#3E424E] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#202227] border border-[#2E313A] flex items-center justify-center">
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </div>
                  <span className="text-xs text-[#34D399] font-medium bg-[#10B981]/10 px-2.5 py-0.5 rounded-full">
                    Connected
                  </span>
                </div>
                <div className="text-sm font-bold text-white tracking-tight">GitHub</div>
                <div className="text-xs text-[#9CA3AF] mt-0.5">alex-founder</div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#2E313A] flex items-center justify-between">
                <span className="text-xs text-[#9CA3AF]">Activity Sync</span>
                {renderToggle(channels.github, (val) => setChannels({ ...channels, github: val }))}
              </div>
            </motion.div>

            {/* Local Leads SQLite */}
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              className="bg-[#18191D] border border-[#2E313A] rounded-xl p-4 flex flex-col justify-between hover:border-[#3E424E] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#202227] border border-[#2E313A] flex items-center justify-center text-[#D2F83D]">
                    <Database className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-[#34D399] font-medium bg-[#10B981]/10 px-2.5 py-0.5 rounded-full">
                    2,174 Contacts
                  </span>
                </div>
                <div className="text-sm font-bold text-white tracking-tight">Local Business Contacts</div>
                <div className="text-xs text-[#9CA3AF] mt-0.5">leads.json (Offline)</div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#2E313A] flex items-center justify-between">
                <span className="text-xs text-[#9CA3AF]">Keep Updated</span>
                {renderToggle(channels.database, (val) => setChannels({ ...channels, database: val }))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
