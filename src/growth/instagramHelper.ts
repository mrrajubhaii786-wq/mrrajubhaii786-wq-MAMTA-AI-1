export function prepareInstagramPost(content: any) {
  return {
    caption: content.caption || content.reel,
    hashtags: content.hashtags || "#AI #SaaS #Growth #Viral",
    reminder: "Post this on Instagram manually with ready-made tags!",
    ready: true,
    timestamp: Date.now()
  };
}
