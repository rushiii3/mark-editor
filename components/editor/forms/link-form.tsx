// components/editor/forms/link-form.tsx

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type LinkFormProps = {
  onSubmit: (url: string, text: string) => void;
};

export function LinkForm({ onSubmit }: LinkFormProps) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!url.trim()) return;

    onSubmit(url.trim(), text.trim());

    setUrl("");
    setText("");
  };

  return (
    <FieldGroup>
      <Field>
        <Input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </Field>

      <Field>
        <Input
          placeholder="Link text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Field>

      <Button onClick={handleSubmit}>Insert Link</Button>
    </FieldGroup>
  );
}
