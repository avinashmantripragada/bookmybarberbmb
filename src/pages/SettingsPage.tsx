import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Mail, Globe, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const [pushNotif, setPushNotif] = useState(true);
  const [appNotif, setAppNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!value)}
      className={`w-12 h-7 rounded-full transition-all duration-200 relative ${value ? 'gold-gradient' : 'bg-secondary'}`}>
      <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-foreground transition-all duration-200 ${value ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
      </div>

      <div className="px-5 space-y-2">
        {/* Notifications Section */}
        <p className="text-xs text-muted-foreground uppercase tracking-wider mt-2 mb-1">Notifications</p>

        <div className="glass-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Push Notifications</span>
          </div>
          <Toggle value={pushNotif} onChange={setPushNotif} />
        </div>

        <div className="glass-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-primary" />
            <span className="text-sm font-medium text-foreground">App Notifications</span>
          </div>
          <Toggle value={appNotif} onChange={setAppNotif} />
        </div>

        <div className="glass-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Email Notifications</span>
          </div>
          <Toggle value={emailNotif} onChange={setEmailNotif} />
        </div>

        {/* Language */}
        <p className="text-xs text-muted-foreground uppercase tracking-wider mt-4 mb-1">Language</p>

        <button onClick={() => setShowLangPicker(true)} className="w-full glass-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe size={18} className="text-primary" />
            <span className="text-sm font-medium text-foreground">App Language</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{languages.find(l => l.code === selectedLang)?.label}</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </div>
        </button>
      </div>

      {/* Language Picker Modal */}
      {showLangPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm">
          <motion.div initial={{ y: 300 }} animate={{ y: 0 }} className="w-full max-w-lg bg-card border-t border-border rounded-t-3xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Select Language</h3>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {languages.map(lang => (
                <button key={lang.code} onClick={() => { setSelectedLang(lang.code); setShowLangPicker(false); toast.success(`Language set to ${lang.label}`); }}
                  className={`w-full p-4 rounded-xl text-left text-sm font-medium transition-all ${
                    selectedLang === lang.code ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-foreground'
                  }`}>
                  {lang.label}
                </button>
              ))}
            </div>
            <button onClick={() => setShowLangPicker(false)} className="w-full mt-4 h-12 bg-secondary rounded-2xl text-sm text-muted-foreground font-medium">
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
