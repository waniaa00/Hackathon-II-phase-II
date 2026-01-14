import { LogoProps } from '@/app/lib/types';

export function Logo({ size = 'medium', onClick }: LogoProps) {
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl',
  };

  const iconSizeClasses = {
    small: 'w-6 h-6 text-base',
    medium: 'w-8 h-8 text-xl',
    large: 'w-10 h-10 text-2xl',
  };

  return (
    <div
      className={`flex items-center gap-2 ${onClick ? 'cursor-pointer hover:opacity-80' : ''}`}
      onClick={onClick}
    >
      <div className={`flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 ${iconSizeClasses[size]} backdrop-blur-sm`}>
        <span className="text-white font-bold">✓</span>
      </div>
      <span className={`${sizeClasses[size]} font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}>
        TASKIFY
      </span>
    </div>
  );
}
