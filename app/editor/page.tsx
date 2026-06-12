import { EditorWorkspace } from "@/components/editor/editor-workspace";
import { promises as fs } from "fs";

export default async function EditorPage() {
  // const content = await fs.readFile(
  //   '/Users/hrushishinde/Downloads/DESIGN.md',
  //   'utf8'
  // );

  // console.log(content);
  return <EditorWorkspace />;
}
