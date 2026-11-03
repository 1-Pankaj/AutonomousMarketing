import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, FileText, CheckCircle2, ShieldCheck, ArrowUpRight, Cpu } from 'lucide-react';
import { Lead } from '../types';
import { useStudio } from '../context/StudioContext';
import { AIProviderId, aiClient } from '../services/aiClient';

interface ModalSendProposalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
  onSend: (data: { recipient: string; packageType: string; amount: string }) => void;
}

export const ModalSendProposal: React.FC<ModalSendProposalProps> = ({ isOpen, onClose, lead, onSend }) => {
  const { settings, showToast } = useStudio();
  const [selectedTier, setSelectedTier] = useState<'sprint' | 'overhaul'>('sprint');
  const [selectedAi, setSelectedAi] = useState<AIProviderId>(settings.aiProvider || 'antigravity');
  const [isAiPersonalizing, setIsAiPersonalizing] = useState(false);
  const targetLead = lead || {
    id: 'lead-default',
    name: 'Dr. Elena Rostova',
    domain: 'meridianclinics.org',
    category: 'Healthcare Clinic',
    healthScore: 32,
    healthStatus: 'Critical' as const,
    vulnerability: 'Mobile portal latency and booking calendar drop-offs',
    opportunityValue: '$8,500'
  };

  const [emailText, setEmailText] = useState(
    `Hi Dr. Rostova,\n\nAttached is the 2-page modernization audit we prepared for ${targetLead.name} regarding your 5.1s mobile portal load times.\n\nOur 14-day sprint migrates your appointment calendar to a modern edge frontend, dropping load time to under 0.8s without touching your existing patient records database.\n\nWould you be open to a 10-minute walkthrough this Thursday?`
  );

  // Sync draft message whenever active lead changes
  useEffect(() => {
    if (lead) {
      const contact = lead.contactPerson ? `Hi ${lead.contactPerson},\n\n` : `Hi ${lead.name} Team,\n\n`;
      const issue = lead.vulnerability
        ? `regarding ${lead.vulnerability.toLowerCase()}`
        : `regarding website speed and mobile usability improvements`;
      setEmailText(
        `${contact}Attached is the 2-page modernization review we prepared for ${lead.name} (${lead.domain}) ${issue}.\n\nOur 14-day sprint migrates your core user flow to a modern, responsive edge architecture, cutting load times without touching your existing databases or operations.\n\nWould you be open to a 10-minute walkthrough this week?`
      );
    }
  }, [lead]);

  // Apple HIG: Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handlePersonalizeAi = async () => {
    setIsAiPersonalizing(true);
    try {
      const generated = await aiClient.generateText({
        prompt: `Personalize a direct, respectful outreach proposal to ${targetLead.name} (${targetLead.domain}) addressing their ${targetLead.vulnerability || 'mobile latency and checkout bottlenecks'}. Package: ${selectedTier === 'sprint' ? '14-Day Sprint' : 'Full Overhaul'}.`,
        context: `Recipient: ${targetLead.name}, Domain: ${targetLead.domain}`,
        providerId: selectedAi,
        endpoint: settings.aiEndpoint,
        model: settings.aiModel,
        apiKey: settings.aiApiKey,
      });
      if (generated) {
        setEmailText(generated);
        showToast('Proposal Personalized', `Generated custom scope using selected AI assistant.`, 'success');
      }
    } catch {
      showToast('AI Notice', 'Proposal remains ready in default template.', 'info');
    } finally {
      setIsAiPersonalizing(false);
    }
  };

  const handleSubmit = () => {
    onSend({
      recipient: targetLead.name,
      packageType: selectedTier === 'sprint' ? '14-Day Performance Sprint' : 'Complete Architecture Overhaul',
      amount: selectedTier === 'sprint' ? '$8,500' : '$14,000'
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-md p-4 select-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#202227]/95 backdrop-blur-2xl border border-[#2E313A] border-t-white/[0.12] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2E313A] bg-[#1C1D22]/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#3B66F5] text-white flex items-center justify-center font-bold">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">Send Client Proposal &amp; Audit</h2>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    Send website audit review and scope to <strong className="text-white">{targetLead.name}</strong>.
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#2E313A] transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Package Selector */}
              <div>
                <label className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider block mb-2">
                  Select Modernization Scope
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTier('sprint')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedTier === 'sprint'
                        ? 'bg-[#252830] border-[#D2F83D] shadow-md shadow-[#D2F83D]/5 ring-1 ring-[#D2F83D]/30'
                        : 'bg-[#18191D] border-[#2E313A] hover:border-[#3E424E]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white">14-Day Rapid Sprint</span>
                      <span className="text-sm font-bold text-[#D2F83D]">$8,500</span>
                    </div>
                    <p className="text-xs text-[#9CA3AF] leading-relaxed">
                      Next.js edge booking portal + 85% query latency cut. Fast turnaround.
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTier('overhaul')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedTier === 'overhaul'
                        ? 'bg-[#252830] border-[#3B66F5] shadow-md shadow-[#3B66F5]/5 ring-1 ring-[#3B66F5]/30'
                        : 'bg-[#18191D] border-[#2E313A] hover:border-[#3E424E]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white">Complete Architecture Overhaul</span>
                      <span className="text-sm font-bold text-[#60A5FA]">$14,000</span>
                    </div>
                    <p className="text-xs text-[#9CA3AF] leading-relaxed">
                      Full custom portal + automated WhatsApp alerts + database indexing.
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Email Body Preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
                    Proposal Message (Plain Business English)
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#8A8F9E]">AI:</span>
                    {(['antigravity', 'claude', 'ollama', 'openai'] as const).map(p => {
                      const labels = {
                        antigravity: 'Antigravity',
                        claude: 'Claude',
                        ollama: 'Ollama',
                        openai: 'OpenAI',
                      };
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setSelectedAi(p)}
                          className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                            selectedAi === p
                              ? 'bg-[#252830] text-white border border-[#3E424E]'
                              : 'text-[#8A8F9E] hover:text-white'
                          }`}
                        >
                          {labels[p]}
                        </button>
                      );
                    })}

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      disabled={isAiPersonalizing}
                      onClick={handlePersonalizeAi}
                      className="flex items-center gap-1 px-2.5 py-1 bg-[#252830] hover:bg-[#2E313A] border border-[#2E313A] text-xs font-bold text-white rounded-lg transition-colors cursor-pointer ml-1"
                    >
                      <Cpu className={`w-3.5 h-3.5 ${isAiPersonalizing ? 'animate-spin text-[#3B66F5]' : 'text-[#60A5FA]'}`} />
                      <span>{isAiPersonalizing ? 'Personalizing...' : 'Personalize with AI'}</span>
                    </motion.button>
                  </div>
                </div>
                <textarea
                  rows={5}
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  className="w-full bg-[#18191D] border border-[#2E313A] rounded-xl p-3.5 text-sm text-white placeholder-[#6B7280] focus:outline-none focus:border-[#3B66F5] resize-none leading-relaxed"
                />
              </div>

              {/* PDF Attachment Banner */}
              <div className="p-3.5 bg-[#18191D] border border-[#2E313A] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#2A1618] border border-[#7F1D1D]/40 text-[#F87171] flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Audit_Report_{targetLead.domain.replace(/\./g, '_')}.pdf</div>
                    <div className="text-xs text-[#9CA3AF] mt-0.5">1.4 MB • 2-Page Executive Summary</div>
                  </div>
                </div>

                <span className="text-xs text-[#34D399] bg-[#10B981]/10 px-2.5 py-0.5 rounded border border-[#065F46]/30 font-medium">
                  Attached &amp; Signed
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#2E313A] bg-[#1C1D22]/80">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-4 py-2 bg-[#202227] hover:bg-[#252830] border border-[#2E313A] text-xs font-semibold text-[#9CA3AF] hover:text-white rounded-lg transition-colors"
              >
                Cancel
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2 bg-[#3B66F5] hover:bg-[#2F52C4] text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-[#3B66F5]/20"
              >
                <span>Send Proposal &amp; Audit</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
