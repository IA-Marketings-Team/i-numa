
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export interface ConsultationsPaginationProps {
  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const ConsultationsPagination: React.FC<ConsultationsPaginationProps> = ({
  page,
  totalPages,
  setPage
}) => {
  const goToFirstPage = () => setPage(1);
  const goToPreviousPage = () => setPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setPage(prev => Math.min(prev + 1, totalPages));
  const goToLastPage = () => setPage(totalPages);

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={goToFirstPage}
        disabled={page === 1}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={goToPreviousPage}
        disabled={page === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <span className="text-sm">
        Page {page} sur {totalPages}
      </span>
      
      <Button
        variant="outline"
        size="icon"
        onClick={goToNextPage}
        disabled={page === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={goToLastPage}
        disabled={page === totalPages}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ConsultationsPagination;
