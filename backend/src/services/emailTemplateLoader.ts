import fs from 'fs';
import path from 'path';

const templateCache = new Map<string, string>();

function templatesDir(): string {
  const candidates = [
    path.join(__dirname, '..', 'templates', 'html'),
    path.join(process.cwd(), 'src', 'templates', 'html'),
    path.join(process.cwd(), 'dist', 'templates', 'html'),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  throw new Error('Email templates directory not found');
}

export function renderEmailTemplate(
  templateName: string,
  variables: Record<string, string>
): string {
  if (!templateCache.has(templateName)) {
    const filePath = path.join(templatesDir(), `${templateName}.html`);
    templateCache.set(templateName, fs.readFileSync(filePath, 'utf8'));
  }

  let html = templateCache.get(templateName)!;
  for (const [key, value] of Object.entries(variables)) {
    html = html.split(`{{${key}}}`).join(value ?? '');
  }
  return html;
}

export function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
