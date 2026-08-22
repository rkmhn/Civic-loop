import React, { useState, useMemo } from 'react';
import { useCivic } from '../context/CivicContext';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, AlertCircle, Info, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationItem {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info';
  timestamp: string;
  route?: string;
  read: boolean;
}

export const NotificationsBell: React.FC = () => {
  const { reports, proposals, hotspots, language } = useCivic();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('civicloop_read_notifications');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  const notifications = useMemo((): NotificationItem[] => {
    const items: NotificationItem[] = [];
    // Recent resolved reports
    reports.filter(r => r.status === 'Resolved').slice(0, 3).forEach(r => {
      items.push({
        id: `resolved-${r.id}`,
        message: `Ticket #${r.id} has been resolved by ${r.department}`,
        type: 'success',
        timestamp: r.updatedAt,
        route: '/track',
        read: false,
      });
    });
    // Critical reports
    reports.filter(r => r.priority === 'Critical' && r.status !== 'Resolved').slice(0, 2).forEach(r => {
      items.push({
        id: `critical-${r.id}`,
        message: `Critical: ${r.title} — needs immediate attention`,
        type: 'warning',
        timestamp: r.createdAt,
        route: '/track',
        read: false,
      });
    });
    // Funded proposals
    proposals.filter(p => p.status === 'Funded').slice(0, 2).forEach(p => {
      items.push({
        id: `funded-${p.id}`,
        message: `Proposal #${p.id} "${p.title}" has been funded!`,
        type: 'success',
        timestamp: p.createdAt,
        route: '/vote',
        read: false,
      });
    });
    // New hotspots
    hotspots.filter(h => h.severity === 'Critical').slice(0, 2).forEach(h => {
      items.push({
        id: `hotspot-${h.id}`,
        message: `Critical hotspot detected: ${h.title} (${h.reportCount} reports)`,
        type: 'warning',
        timestamp: new Date().toISOString(),
        route: '/hotspots',
        read: false,
      });
    });
    return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [reports, proposals, hotspots]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !readIds.has(n.id)).length;
  }, [notifications, readIds]);

  const markAsRead = (id: string) => {
    const newSet = new Set(readIds);
    newSet.add(id);
    setReadIds(newSet);
    try { localStorage.setItem('civicloop_read_notifications', JSON.stringify([...newSet])); } catch {}
  };

  const markAllRead = () => {
    const newSet = new Set(notifications.map(n => n.id));
    setReadIds(newSet);
    try { localStorage.setItem('civicloop_read_notifications', JSON.stringify([...newSet])); } catch {}
  };

  const clearAll = () => {
    setReadIds(new Set());
    try { localStorage.removeItem('civicloop_read_notifications'); } catch {}
  };

  const formatTime = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
      case 'warning': return <AlertCircle className="w-3.5 h-3.5 text-orange-600 shrink-0" />;
      default: return <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <Bell className="w-4.5 h-4.5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Notifications</span>
              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <button type="button" onClick={markAllRead} className="text-[10px] text-orange-600 hover:text-orange-800 font-semibold">
                    Mark all read
                  </button>
                )}
                <button type="button" onClick={clearAll} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">No notifications yet</div>
              ) : (
                notifications.map(n => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => {
                      markAsRead(n.id);
                      if (n.route) navigate(n.route);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors flex items-start gap-2.5 ${!readIds.has(n.id) ? 'bg-orange-50/30' : ''}`}
                  >
                    {getTypeIcon(n.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-slate-800 leading-relaxed font-medium">{n.message}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{formatTime(n.timestamp)}</p>
                    </div>
                    {!readIds.has(n.id) && (
                      <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-1" />
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
