/**
 * Scans tracked source for accidental secret commits.
 * Run: npm run check-secrets
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '..');
const SCAN_DIRS = ['src', 'scripts'].map((d) => path.join(ROOT, d));

const ALLOWED_PLACEHOLDER_FRAGMENTS = [
  'your_razorpay_secret_here',
  'rzp_test_your_key_here',
  'your_twilio_auth_token_here',
  'your_cloud_name',
  'your_api_key',
  'your_api_secret',
  'change_me_to_a_long_random_string',
  'your_jwt_secret',
  're_your_resend_api_key_here',
  'test_secret',
  'demo-token-',
  'demo_order_',
  'demo_pay_',
  'demo_sig_',
];

const FORBIDDEN_PATTERNS: { name: string; regex: RegExp }[] = [
  { name: 'MongoDB connection string with credentials', regex: /mongodb\+srv:\/\/[^:]+:[^@]+@/i },
  { name: 'Razorpay live secret pattern', regex: /rzp_live_[A-Za-z0-9]{10,}/ },
  { name: 'Twilio Account SID', regex: /AC[a-f0-9]{32}/i },
  { name: 'Resend API key', regex: /re_[A-Za-z0-9_]{20,}/ },
  {
    name: 'Hardcoded demo password',
    regex: new RegExp('Atomik' + '@' + '123'),
  },
  { name: 'AWS access key', regex: /AKIA[0-9A-Z]{16}/ },
  { name: 'Private key block', regex: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/ },
];

function listSourceFiles(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '__tests__') continue;
      listSourceFiles(full, out);
    } else if (/\.(ts|js|tsx|jsx)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function isAllowedPlaceholder(line: string, match: string): boolean {
  return ALLOWED_PLACEHOLDER_FRAGMENTS.some((p) => line.includes(p) || match.includes(p));
}

function main(): void {
  const files = SCAN_DIRS.flatMap((d) => listSourceFiles(d));
  const findings: string[] = [];

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, index) => {
      for (const { name, regex } of FORBIDDEN_PATTERNS) {
        const match = line.match(regex)?.[0];
        if (match && !isAllowedPlaceholder(line, match)) {
          findings.push(`${rel}:${index + 1} — ${name}`);
        }
      }
    });
  }

  if (findings.length > 0) {
    console.error('Secret scan failed:\n');
    findings.forEach((f) => console.error(`  • ${f}`));
    console.error('\nMove credentials to backend/.env or frontend/.env (gitignored).');
    process.exit(1);
  }

  console.log(`Secret scan passed (${files.length} files).`);
}

main();
