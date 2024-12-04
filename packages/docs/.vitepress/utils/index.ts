import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

export function loadJsonFile(filePath: string) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function getProjectRootDir() {
    return process.cwd();
}

export function getPackageJsonVersion() {
    const rootDir = getProjectRootDir();
    const packageJsonPath = path.join(rootDir, './package.json');
    const packageJson = loadJsonFile(packageJsonPath);
    return packageJson.version;
}
