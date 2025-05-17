
import React from 'react';
import { Feather } from 'lucide-react'; // Using Feather as a generic "creation" icon

const Logo = ({ size = "text-3xl" }: { size?: string }) => {
  return (
    <div className={`flex items-center font-bold ${size} text-primary`}>
      <Feather className="mr-2 h-auto w-auto" style={{ fontSize: 'inherit' }} />
      <span>PromptForge</span>
    </div>
  );
};

export default Logo;
