import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TitleBar } from './components/TitleBar';
import { NavigationDock } from './components/NavigationDock';
import { StudioHub } from './screens/StudioHub';
import { ContentStudio } from './screens/ContentStudio';
import { LeadRadar } from './screens/LeadRadar';
import { ClientOpportunities } from './screens/ClientOpportunities';
import { GrowthAnalytics } from './screens/GrowthAnalytics';
import { StudioSettings } from './screens/StudioSettings';
import { DailySprint } from './screens/DailySprint';
import { AuditReport } from './screens/AuditReport';
import { ModalNewPost } from './components/ModalNewPost';
import { ModalSendProposal } from './components/ModalSendProposal';
import { ToastContainer } from './components/ToastContainer';
import { AccountPopover } from './components/AccountPopover';
import { NotificationsPopover } from './components/NotificationsPopover';
import { StudioProvider, useStudio } from './context/StudioContext';

const AppContent: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    theme,
    setTheme,
    leads,
    posts,
    selectedLead,
    notifications,
    toasts,
    settings,
    isNewPostOpen,
    setIsNewPostOpen,
    isProposalOpen,
    setIsProposalOpen,
    isAccountOpen,
    setIsAccountOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    openAudit,
    openProposal,
    closeProposal,
    schedulePost,
    publishPost,
    updateSettings,
    sendProposal,
    exportLeadsCSV,
    showToast,
    dismissToast,
    markNotificationRead,
    markAllNotificationsRead,
    dismissNotification,
  } = useStudio();

  return (
    <div
      className={`flex flex-col h-screen w-screen overflow-hidden font-sans select-none antialiased transition-colors ${
        theme === 'light' ? 'light bg-[#F5F6F8] text-[#111827]' : 'dark bg-[#18191D] text-white'
      }`}
    >
      {/* Frameless Desktop Titlebar */}
      <TitleBar
        onNotify={showToast}
        theme={theme}
        onToggleTheme={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
      />

      {/* Main Studio Body: Left Dock + Active Screen */}
      <div className="flex-1 flex overflow-hidden relative">
        <NavigationDock
          activeScreen={activeScreen}
          onSelectScreen={(screen) => setActiveScreen(screen)}
          onOpenAccount={() => setIsAccountOpen(prev => !prev)}
          onToggleNotifications={() => setIsNotificationsOpen(prev => !prev)}
          isNotificationsOpen={isNotificationsOpen}
          unreadCount={notifications.filter(n => !n.read).length}
        />

        {/* Dynamic Screen Viewport with Apple Fluid Transition */}
        <main className="flex-1 flex overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 6, scale: 0.996 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.996 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex overflow-hidden"
            >
              {activeScreen === 'hub' && (
                <StudioHub
                  onOpenNewPost={() => setIsNewPostOpen(true)}
                  onOpenSprint={() => setActiveScreen('sprint')}
                  onOpenAudit={() => setActiveScreen('radar')}
                />
              )}

              {activeScreen === 'content' && (
                <ContentStudio
                  posts={posts}
                  onOpenNewPost={() => setIsNewPostOpen(true)}
                  onPublishPost={(title) => publishPost(title)}
                />
              )}

              {activeScreen === 'radar' && (
                <LeadRadar
                  onOpenAudit={openAudit}
                  onOpenProposal={openProposal}
                />
              )}

              {activeScreen === 'stream' && (
                <ClientOpportunities
                  onOpenProposal={(name, domain) => openProposal(name, domain)}
                  onShowToast={showToast}
                />
              )}

              {activeScreen === 'analytics' && (
                <GrowthAnalytics />
              )}

              {activeScreen === 'settings' && (
                <StudioSettings
                  onShowToast={showToast}
                  founderName={settings.founderName}
                  theme={theme}
                  onSetTheme={(t) => setTheme(t)}
                  onUpdateFounderName={(name) => updateSettings({ founderName: name })}
                />
              )}

              {activeScreen === 'sprint' && (
                <DailySprint
                  onOpenProposal={(name, domain) => openProposal(name, domain)}
                  onShowToast={showToast}
                />
              )}

              {activeScreen === 'audit' && (
                <AuditReport
                  lead={selectedLead}
                  onBack={() => setActiveScreen('radar')}
                  onOpenProposal={(name, domain) => openProposal(name, domain)}
                  onShowToast={showToast}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Local Workspace Popover */}
        <AccountPopover
          isOpen={isAccountOpen}
          onClose={() => setIsAccountOpen(false)}
          onNavigate={(screen) => setActiveScreen(screen)}
          onShowToast={showToast}
          onExportCSV={exportLeadsCSV}
          leadCount={leads.length}
        />

        {/* Notifications Popover */}
        <NotificationsPopover
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          notifications={notifications}
          onMarkAllRead={markAllNotificationsRead}
          onSelectNotification={(notif) => {
            markNotificationRead(notif.id);
            setIsNotificationsOpen(false);
            if (notif.targetScreen) setActiveScreen(notif.targetScreen);
          }}
          onDismissNotification={dismissNotification}
        />
      </div>

      {/* Modals & Overlays */}
      <ModalNewPost
        isOpen={isNewPostOpen}
        onClose={() => setIsNewPostOpen(false)}
        onSchedulePost={schedulePost}
      />

      <ModalSendProposal
        isOpen={isProposalOpen}
        onClose={closeProposal}
        lead={selectedLead}
        onSend={sendProposal}
      />

      {/* Floating System Toasts */}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <StudioProvider>
      <AppContent />
    </StudioProvider>
  );
};

export default App;
