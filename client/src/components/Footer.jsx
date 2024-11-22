import React from 'react'
import { MessageSquare } from 'lucide-react'
const Footer = () => {
  return (
    <footer className="footer footer-center p-4 bg-base-200/50 text-base-content border-t border-base-200 h-16">
          <aside className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-5 text-primary" />
          <p className="font-semibold">ChatAppByKhalil</p>
        </div>
        <p className="text-sm text-base-content/70">
          Copyright © {new Date().getFullYear()} - All rights reserved
        </p>
      </aside>
    </footer>
  );
};

export default Footer