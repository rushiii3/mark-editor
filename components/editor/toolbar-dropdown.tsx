import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";

type ToolbarDropdownProps = {
  icon: React.ReactNode;
  label: string;
  width?: string;
  children: React.ReactNode;
};

export function ToolbarDropdown({
  icon,
  label,
  width = "w-60",
  children
}: ToolbarDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          className="rounded-md px-2.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {icon}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className={width}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
          {children}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
