
import React, { useState, useRef, useEffect } from "react";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Sélectionner...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate a lookup of the selected items
  const selectedLookup = selected.reduce((acc: Record<string, true>, value) => {
    acc[value] = true;
    return acc;
  }, {});

  // Find the display labels for selected values
  const selectedLabels = options
    .filter(option => selectedLookup[option.value])
    .map(option => option.label);

  const handleSelect = (value: string) => {
    const isSelected = selectedLookup[value];
    
    // Create a new array based on whether we're adding or removing
    const newSelected = isSelected
      ? selected.filter(item => item !== value)
      : [...selected, value];
    
    onChange(newSelected);
  };

  // Focus the input when the popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-1 mr-2 max-w-[90%] overflow-hidden">
              {selected.length <= 3 ? (
                selectedLabels.map(label => (
                  <Badge key={label} variant="secondary" className="mr-1">
                    {label}
                  </Badge>
                ))
              ) : (
                <span>{selected.length} sélectionnés</span>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Rechercher..." ref={inputRef} />
          <CommandEmpty>Aucun résultat trouvé</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedLookup[option.value] ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        {selected.length > 0 && (
          <div className="p-2 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-center text-sm text-muted-foreground"
              onClick={() => onChange([])}
            >
              <X className="mr-2 h-4 w-4" />
              Tout effacer
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
