'use client'

import React from 'react';
import { useBlob } from '@/app/contexts/BlobContext';

const AnimatedBlob: React.FC = () => {
  const { isPending, isSafe, isTransactionComplete } = useBlob();
  const color = isSafe ? '#08ff7a' : '#3b82f6';
  const opacity = isSafe ? 0.35 : 0.5;
  
  const getAnimationStyle = () => {
    if (isPending) {
      return {
        animation: isSafe ? 'pulse 15s infinite' : 'pulse 7s infinite',
      };
    }
    if (isTransactionComplete) {
      return {
        animation: 'explode 1s ease-in',
      };
    }
    return {
        width: '75%',
        height: '75%',
        filter: 'blur(120px)',
        opacity: 1,
    };
  };
  
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-neutral-900">
      <div 
        className="absolute top-[calc(50%+50px)] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[900px] h-full max-h-[900px] rounded-full"
        style={{
          background: `radial-gradient(circle at center, ${color} 0%, #171717 70%)`,
          opacity,
          ...getAnimationStyle(),
        }}
      />
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(0.3);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2);
            filter: blur(120px);
          }
        }

        @keyframes explode {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.5;
            filter: blur(120px);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBlob; 