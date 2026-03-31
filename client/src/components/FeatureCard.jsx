import React from 'react';
import { LucideIcon } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-[#1A1C22] p-6 rounded-xl border border-[#2A2D36] hover:border-[#FF7A00] transition-all duration-300 hover:shadow-lg hover:shadow-[#FF7A00]/20 hover:-translate-y-1">
      <div className="w-12 h-12 bg-gradient-to-r from-[#FF7A00] to-[#FFB800] rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-[#A0A3BD] leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;