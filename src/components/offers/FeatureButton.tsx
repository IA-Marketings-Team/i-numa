
import React from "react";
import { cn } from "@/lib/utils";

interface FeatureButtonProps {
  icon: React.ReactNode;
  text: string;
  highlight?: string;
  className?: string;
}

const FeatureButton: React.FC<FeatureButtonProps> = ({ 
  icon, 
  text, 
  highlight,
  className 
}) => {
  // Split text and highlight if needed
  let beforeHighlight = "";
  let afterHighlight = "";
  
  if (highlight && text.includes(highlight)) {
    const parts = text.split(highlight);
    beforeHighlight = parts[0];
    afterHighlight = parts[1] || "";
  }

  return (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-xl transition-all",
      "bg-gray-900/60 hover:bg-gray-800/80 border border-gray-800 hover:border-gray-700",
      "cursor-pointer hover:shadow-md",
      className
    )}>
      <div className="text-primary/80">
        {icon}
      </div>
      <div className="text-sm text-gray-200">
        {highlight ? (
          <>
            {beforeHighlight}
            <span className="font-semibold text-white">{highlight}</span>
            {afterHighlight}
          </>
        ) : (
          text
        )}
      </div>
    </div>
  );
};

export default FeatureButton;
