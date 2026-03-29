import React from 'react';


interface TypographyBannerProps {
  title: string;
  theme?: 'green' | 'blue' | 'purple' | 'orange' | 'neutral';
  className?: string;
}


const themeStyles: Record<
  'green' | 'blue' | 'purple' | 'orange' | 'neutral',
  string
> = {
  green: 'bg-gradient-to-br from-green-800/30 to-black',
  blue: 'bg-gradient-to-br from-blue-800/30 to-black',
  purple: 'bg-gradient-to-br from-purple-800/30 to-black',
  orange: 'bg-gradient-to-br from-orange-800/30 to-black',
  neutral: 'bg-gradient-to-br from-zinc-800/30 to-black',
};

export const TypographyBanner: React.FC<TypographyBannerProps> = ({ title, theme, className = '' }) => {
  const bgClass = themeStyles[theme as keyof typeof themeStyles] || themeStyles.neutral;
  return (
    <div
      className={`
        flex items-center justify-center
        h-44 w-full
        ${bgClass}
        rounded-t-2xl
        backdrop-blur-md
        border-b border-black/5 dark:border-white/10
        transition-transform duration-500 group-hover:scale-[1.03] group-hover:shadow-lg
        ${className}
      `}
      style={{ minHeight: '11rem' }}
    >
      <span className="text-2xl md:text-3xl font-extrabold text-black/80 dark:text-white/90 drop-shadow-sm text-center select-none">
        {title}
      </span>
    </div>
  );
};
