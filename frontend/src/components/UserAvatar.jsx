"use client";

import { cn } from '@/lib/utils';
import { getAvatarInitials } from '@/lib/avatar';

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-16 w-16 text-xl',
  xl: 'h-24 w-24 text-2xl',
};

const UserAvatar = ({ user, size = 'md', className }) => {
  const initials = getAvatarInitials(user);
  const avatarUrl = user?.avatar_url;

  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-full bg-[#0F172A] font-bold text-white',
        sizeClasses[size] || sizeClasses.md,
        className
      )}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={user?.name ? `${user.name} profile photo` : 'Profile photo'}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="grid h-full w-full place-items-center">{initials}</span>
      )}
    </div>
  );
};

export default UserAvatar;
