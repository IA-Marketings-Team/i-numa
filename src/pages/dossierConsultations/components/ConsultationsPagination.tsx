
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface ConsultationsPaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

const ConsultationsPagination: React.FC<ConsultationsPaginationProps> = ({
  page,
  totalPages,
  setPage,
}) => {
  const handleFirstPage = () => setPage(1);
  const handlePreviousPage = () => setPage(Math.max(1, page - 1));
  const handleNextPage = () => setPage(Math.min(totalPages, page + 1));
  const handleLastPage = () => setPage(totalPages);

  // Generate page buttons
  const generatePageButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Add page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={page === i ? "default" : "outline"}
          size="sm"
          onClick={() => setPage(i)}
          className="w-8 h-8 p-0"
        >
          {i}
        </Button>
      );
    }
    
    return buttons;
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={handleFirstPage}
        disabled={page === 1}
        className="w-8 h-8 p-0"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePreviousPage}
        disabled={page === 1}
        className="w-8 h-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {generatePageButtons()}
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleNextPage}
        disabled={page === totalPages}
        className="w-8 h-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLastPage}
        disabled={page === totalPages}
        className="w-8 h-8 p-0"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ConsultationsPagination;
