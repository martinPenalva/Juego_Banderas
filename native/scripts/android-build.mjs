import { spawnSync } from 'node:child_process';
const windows = process.platform === 'win32';
const result = spawnSync(windows ? 'gradlew.bat' : './gradlew', ['assembleDebug'], {
  cwd: new URL('../../android/', import.meta.url), stdio: 'inherit', shell: windows
});
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
