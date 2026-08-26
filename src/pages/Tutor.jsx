import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Search, PanelLeftClose, PanelLeftOpen, Sparkles, Globe2, Brain,
  Settings2, MoreHorizontal, Trash2, Pencil, Menu, X,
} from 'lucide-react';
import Seo from '../components/ui/Seo.jsx';
import TutorPanel from '../components/tutor/TutorPanel.jsx';
import TutorPersonaChips from '../components/tutor/TutorPersonaChips.jsx';
import { getPersonaById } from '../components/tutor/tutorPersonas.js';
import useTutorChat from '../hooks/useTutorChat.js';

export default function Tutor() {
  const tutor = useTutorChat();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [search, setSearch] = useState('');

  const persona = getPersonaById(tutor.personaId);
  const chats = tutor.conversations || [];
  const filtered = useMemo(
    () => chats.filter(c => c.title.toLowerCase().includes(search.toLowerCase())),
    [chats, search]
  );

  return (
    <>
      <Seo title="InnoSpeak AI Tutor" description="An adaptive AI learning workspace for InnoSpeak Global." path="/tutor" />

      <div className="fixed inset-0 z-[100] flex overflow-hidden bg-[#f8f7f4] text-navy-900">
        {/* Desktop sidebar */}
        <aside className={`${sidebarOpen ? 'w-[280px]' : 'w-0'} hidden shrink-0 overflow-hidden border-r border-navy-100 bg-white transition-all duration-300 lg:block`}>
          <div className="flex h-full w-[280px] flex-col">
            <div className="flex items-center justify-between border-b border-navy-100 px-4 py-4">
              <div>
                <div className="flex items-center gap-2 font-display text-lg font-bold text-navy-950">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-navy-950 text-gold-300"><Sparkles size={15} /></span>
                  InnoSpeak
                </div>
                <div className="mt-1 text-[11px] font-medium text-navy-400">AI Learning Workspace</div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 text-navy-400 hover:bg-navy-50"><PanelLeftClose size={17} /></button>
            </div>

            <div className="p-3">
              <button onClick={tutor.newConversation} className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-800">
                <Plus size={16} /> New chat
              </button>
            </div>

            <div className="px-3">
              <div className="flex items-center gap-2 rounded-xl border border-navy-100 bg-navy-50/50 px-3 py-2">
                <Search size={15} className="text-navy-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search chats" className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-navy-300" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4">
              <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-navy-400">Recent</div>
              <div className="space-y-1">
                {filtered.map(c => (
                  <button key={c.id} onClick={() => tutor.openConversation(c.id)} className={`group flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs ${c.id === tutor.conversationId ? 'bg-gold-50 text-navy-950' : 'text-navy-600 hover:bg-navy-50'}`}>
                    <span className="min-w-0 flex-1 truncate">{c.title}</span>
                    <span className="hidden text-navy-300 group-hover:block"><MoreHorizontal size={14} /></span>
                  </button>
                ))}
                {!filtered.length && <div className="px-2 py-8 text-center text-xs text-navy-400">No conversations yet.</div>}
              </div>
            </div>

            <div className="border-t border-navy-100 p-3">
              <div className="rounded-xl bg-navy-950 p-3 text-white">
                <div className="flex items-center gap-2 text-xs font-semibold"><Brain size={14} className="text-gold-300" /> Adaptive learning</div>
                <p className="mt-1.5 text-[11px] leading-5 text-white/60">Learn → practise → get feedback → advance.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile drawer */}
        {mobileSidebar && (
          <div className="absolute inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-navy-950/40" onClick={() => setMobileSidebar(false)} />
            <aside className="relative flex h-full w-[290px] flex-col bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-navy-100 p-4">
                <span className="font-display font-bold">InnoSpeak Tutor</span>
                <button onClick={() => setMobileSidebar(false)} className="rounded-lg p-2 hover:bg-navy-50"><X size={18} /></button>
              </div>
              <button onClick={() => { tutor.newConversation(); setMobileSidebar(false); }} className="m-3 flex items-center justify-center gap-2 rounded-xl bg-navy-950 px-4 py-3 text-sm font-semibold text-white"><Plus size={16} /> New chat</button>
              <div className="flex-1 overflow-y-auto px-3">{filtered.map(c => <button key={c.id} onClick={() => { tutor.openConversation(c.id); setMobileSidebar(false); }} className="w-full truncate rounded-xl px-3 py-3 text-left text-xs hover:bg-navy-50">{c.title}</button>)}</div>
            </aside>
          </div>
        )}

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="flex shrink-0 items-center justify-between border-b border-navy-100 bg-white/95 px-3 py-2.5 backdrop-blur-xl sm:px-5">
            <div className="flex min-w-0 items-center gap-2">
              <button onClick={() => setMobileSidebar(true)} className="rounded-lg p-2 text-navy-500 hover:bg-navy-50 lg:hidden"><Menu size={18} /></button>
              {!sidebarOpen && <button onClick={() => setSidebarOpen(true)} className="hidden rounded-lg p-2 text-navy-500 hover:bg-navy-50 lg:block"><PanelLeftOpen size={18} /></button>}
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-navy-950">{tutor.conversationTitle || 'New learning session'}</div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-navy-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> InnoSpeak Tutor · {persona.label}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button title="Web research" onClick={() => tutor.setWebSearch(v => !v)} className={`hidden items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold sm:flex ${tutor.webSearch ? 'bg-blue-50 text-blue-700' : 'text-navy-400 hover:bg-navy-50'}`}><Globe2 size={14} /> Web</button>
              <button title="Deep thinking" onClick={() => tutor.setDeepThink(v => !v)} className={`hidden items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold sm:flex ${tutor.deepThink ? 'bg-gold-50 text-gold-700' : 'text-navy-400 hover:bg-navy-50'}`}><Brain size={14} /> Think</button>
              <button className="rounded-lg p-2 text-navy-400 hover:bg-navy-50"><Settings2 size={17} /></button>
            </div>
          </header>

          <div className="border-b border-navy-100 bg-white px-3 py-2.5 sm:px-5">
            <TutorPersonaChips activeId={tutor.personaId} onChange={tutor.changePersona} />
          </div>

          <div className="flex min-h-0 flex-1">
            <section className="flex min-w-0 flex-1 flex-col">
              <TutorPanel
                personaId={tutor.personaId}
                messages={tutor.messages}
                isSending={tutor.isSending}
                error={tutor.error}
                onSend={tutor.sendMessage}
                onRegenerate={tutor.regenerate}
                onStop={tutor.stop}
                webSearch={tutor.webSearch}
                deepThink={tutor.deepThink}
                variant="workspace"
              />
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
