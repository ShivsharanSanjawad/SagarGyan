import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');

interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

const Select: React.FC<{
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}> = ({ value = "", onValueChange = () => {}, children }) => {
  const [open, setOpen] = React.useState(false);
  
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

const SelectTrigger: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used within Select");
  
  const { open, setOpen } = context;
  
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {children}
      <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", open && "rotate-180")} />
    </button>
  );
};

const SelectValue: React.FC<{
  placeholder?: string;
  className?: string;
}> = ({ placeholder = "Select...", className }) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used within Select");
  
  const { value } = context;
  
  return (
    <span className={cn("truncate", className)}>
      {value || placeholder}
    </span>
  );
};

const SelectContent: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectContent must be used within Select");
  
  const { open, setOpen } = context;
  const contentRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, setOpen]);
  
  if (!open) return null;
  
  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 mt-1 max-h-96 w-full overflow-hidden rounded-md border bg-white shadow-lg animate-in fade-in-0 zoom-in-95",
        className
      )}
    >
      <div className="p-1">{children}</div>
    </div>
  );
};

const SelectItem: React.FC<{
  value: string;
  className?: string;
  children: React.ReactNode;
}> = ({ value, className, children }) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used within Select");
  
  const { value: selectedValue, onValueChange, setOpen } = context;
  const isSelected = value === selectedValue;
  
  const handleClick = () => {
    onValueChange(value);
    setOpen(false);
  };
  
  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100",
        isSelected && "bg-blue-50 text-blue-900",
        className
      )}>
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      <span className="truncate">{children}</span>
    </button>
  );
};

const SelectSeparator: React.FC<{
  className?: string;
}> = ({ className }) => (
  <div className={cn("my-1 h-px bg-gray-200", className)} />
);

const SelectLabel: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <div className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold text-gray-900", className)}>
    {children}
  </div>
);

const SelectGroup: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => <div>{children}</div>;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};