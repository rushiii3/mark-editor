import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type ImageFormProps = {
  onInsertUrl: (url: string, alt: string) => void;

  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function ImageForm({ onInsertUrl, onUpload }: ImageFormProps) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");

  return (
    <FieldGroup>
      <Input
        placeholder="Image URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <Input
        placeholder="Alt text"
        value={alt}
        onChange={(e) => setAlt(e.target.value)}
      />

      <Button
        onClick={() => {
          if (!url.trim()) return;

          onInsertUrl(url.trim(), alt.trim());

          setUrl("");
          setAlt("");
        }}
      >
        Insert Image
      </Button>

      <FieldSeparator>OR</FieldSeparator>

      <Input type="file" accept="image/*" onChange={onUpload} />
    </FieldGroup>
  );
}
