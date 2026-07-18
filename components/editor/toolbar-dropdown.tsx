"use client";
import { memo } from "react";
import { Button } from "../ui/button";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type ToolbarDropdownProps = {
  icon: React.ReactNode;
  label: string;
  width?: string;
  children: React.ReactNode;
};

const ToolbarDropdown = ({
  icon,
  label,
  width = "w-60",
  children
}: ToolbarDropdownProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          className="rounded-md px-2.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {icon}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">{children}</PopoverContent>
    </Popover>
    // <DropdownMenu modal={false}>
    //   <DropdownMenuTrigger asChild>
    //     <Button
    //       variant="ghost"
    //       size="icon-lg"
    //       className="rounded-md px-2.5 text-muted-foreground hover:bg-muted hover:text-foreground"
    //     >
    //       {icon}
    //     </Button>
    //   </DropdownMenuTrigger>

    //   <DropdownMenuContent className={width}>
    //     <DropdownMenuGroup>
    //       <DropdownMenuLabel>{label}</DropdownMenuLabel>
    //       {children}
    //     </DropdownMenuGroup>
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
};

export default memo(ToolbarDropdown);
