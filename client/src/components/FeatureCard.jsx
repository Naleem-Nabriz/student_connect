import React from 'react';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="rounded-[24px] border border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(253,246,236,0.92))] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#0077B6]/30 hover:shadow-[0_18px_40px_rgba(61,61,61,0.10)]">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0077B6,#E07A5F)]">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-[#3D3D3D]">{title}</h3>
      <p className="leading-relaxed text-[#62574d]">{description}</p>
    </div>
  );
};

export default FeatureCard;
