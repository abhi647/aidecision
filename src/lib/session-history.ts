/**
 * Session History — persist chat sessions in localStorage.
 * Each session stores: id, title (first user message), createdAt, and messages.
 */

export interface StoredSession {
  id: string;
  title: string;            // first user message, truncated
  createdAt: string;        // ISO string
  messageCount: number;
  messages: StoredMessage[];
}

export interface StoredMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;        // ISO string (Date serializes to string in JSON)
  analysis?: any;           // full AnalysisResult, stored as-is
}

const STORAGE_KEY = 'boardroom_copilot_sessions';
const MAX_SESSIONS = 20;   // keep last 20 sessions

export function getAllSessions(): StoredSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredSession[];
  } catch {
    return [];
  }
}

export function saveSession(session: StoredSession): void {
  if (typeof window === 'undefined') return;
  try {
    const sessions = getAllSessions();
    const existingIdx = sessions.findIndex(s => s.id === session.id);
    if (existingIdx >= 0) {
      sessions[existingIdx] = session;        // update existing
    } else {
      sessions.unshift(session);              // prepend new session
    }
    // Keep only the last MAX_SESSIONS
    const trimmed = sessions.slice(0, MAX_SESSIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage may be full or unavailable — fail silently
  }
}

export function deleteSession(sessionId: string): void {
  if (typeof window === 'undefined') return;
  const sessions = getAllSessions().filter(s => s.id !== sessionId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function formatSessionDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 2) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
