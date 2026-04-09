import { Button } from '@/components/ui/button';
import { FileText, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">ResearchQ</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => navigate('/')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</button>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</button>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>Log in</Button>
          <Button variant="default" size="sm" onClick={() => navigate('/dashboard')}>Get Started</Button>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border p-4 glass animate-scale-in">
          <div className="flex flex-col gap-3">
            <button onClick={() => { navigate('/'); setMobileOpen(false); }} className="text-sm text-left py-2">Home</button>
            <button onClick={() => { navigate('/dashboard'); setMobileOpen(false); }} className="text-sm text-left py-2">Dashboard</button>
            <Button variant="default" size="sm" onClick={() => { navigate('/dashboard'); setMobileOpen(false); }}>Get Started</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
