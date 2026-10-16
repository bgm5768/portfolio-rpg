export function safeLink(value) {
  try { const url = new URL(value); return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? url.href : null; }
  catch { return null; }
}
export function visibleProjects(items) {
  return items.filter(item => typeof item.title === 'string' && item.title.trim() && typeof item.summary === 'string' && item.summary.trim());
}
