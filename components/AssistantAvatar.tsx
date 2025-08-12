
import React from 'react';

interface AssistantAvatarProps {
    className?: string;
}

const AssistantAvatar: React.FC<AssistantAvatarProps> = ({ className = "w-10 h-10" }) => {
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.currentTarget;
        // Prevent infinite retry loops if the fallback also fails
        if (target.dataset.retried) {
            return;
        }
        target.dataset.retried = 'true';
        // Retry loading the image to ensure it is displayed
        target.src = '/amarastelive.jpg';
    };

    return (
        <img
          src="/amarastelive.jpg"
          alt="Amarasté Avatar"
          loading="lazy"
          className={`${className} rounded-full object-cover shadow-md animate-fade-in ring-2 ring-white/10`}
          onError={handleImageError}
        />
    );
};

export default AssistantAvatar;
