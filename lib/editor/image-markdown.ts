// export const LOCAL_IMAGE_PREFIX = "local-image:";

// export function createImageMarkdown(id: string, alt: string) {
//   const url = `${LOCAL_IMAGE_PREFIX}${id}`;
//   return {url,alt};
// }

export function extractLocalImageIds(markdown: string): string[] {
  const regex = /!\[[^\]]*]\(local-image:([^)]+)\)/g;

  const ids: string[] = [];

  let match: RegExpExecArray | null;

  while ((match = regex.exec(markdown))) {
    ids.push(match[1]);
  }

  return ids;
}
