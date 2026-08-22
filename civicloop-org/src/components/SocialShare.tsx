import React from 'react';
import { Share2, MessageCircle, Twitter, Facebook, Link2, Copy, Check } from 'lucide-react';

interface SocialShareProps {
  title: string;
  text: string;
  url?: string;
  compact?: boolean;
}

export const SocialShare: React.FC<SocialShareProps> = ({ title, text, url, compact = false }) => {
  const [copied, setCopied] = React.useState(false);
  const shareUrl = url || window.location.href;
  const shareText = `${title} — ${text}`;

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`, '_blank');
  };

  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({ title, text, url: shareUrl }).catch(() => {});
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <button type="button" onClick={handleWhatsApp} title="Share on WhatsApp" className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 transition-all">
          <MessageCircle className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={handleTwitter} title="Share on Twitter" className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 transition-all">
          <Twitter className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={handleCopyLink} title="Copy link" className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-all">
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Share:</span>
      <button type="button" onClick={handleWhatsApp} className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 transition-all" title="Share on WhatsApp">
        <MessageCircle className="w-4 h-4" />
      </button>
      <button type="button" onClick={handleTwitter} className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 transition-all" title="Share on Twitter">
        <Twitter className="w-4 h-4" />
      </button>
      <button type="button" onClick={handleFacebook} className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 transition-all" title="Share on Facebook">
        <Facebook className="w-4 h-4" />
      </button>
      <button type="button" onClick={handleCopyLink} className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-all" title="Copy link">
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4" />}
      </button>
      {navigator.share && (
        <button type="button" onClick={handleNativeShare} className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 transition-all" title="Share">
          <Share2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
