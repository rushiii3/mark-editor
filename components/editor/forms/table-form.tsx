import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type TableFormProps = {
  onSubmit: (rows: number, columns: number) => void;
};

export function TableForm({ onSubmit }: TableFormProps) {
  console.log("ImageForm rendered");
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(2);

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {[2, 3, 4].map((size) => (
          <Button key={size} onClick={() => onSubmit(size, size)}>
            {size}x{size}
          </Button>
        ))}
      </div>

      <FieldGroup className="mt-3">
        <div className="flex gap-2">
          <Input
            type="number"
            min={1}
            max={50}
            value={rows}
            onChange={(e) =>
              setRows(Math.min(50, Math.max(1, Number(e.target.value) || 1)))
            }
          />

          <Input
            type="number"
            min={1}
            max={10}
            value={columns}
            onChange={(e) =>
              setColumns(Math.min(10, Math.max(1, Number(e.target.value) || 1)))
            }
          />
        </div>

        <Button onClick={() => onSubmit(rows, columns)}>Insert Table</Button>
      </FieldGroup>
    </>
  );
}
