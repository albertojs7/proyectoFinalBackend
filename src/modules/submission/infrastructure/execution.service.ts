import { execSync, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface ExecutionResult {
    success: boolean;
    output: string;
    error?: string;
    exitCode: number;
    timeMs: number;
}

export class ExecutionService {
    private readonly tempDir = '/tmp/submission-executions';

    constructor() {
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
    }

    /**
     * Ejecuta código en un contenedor Docker según el lenguaje
     */
    async executeInDocker(
        code: string,
        language: string,
        submissionId: string,
        timeoutMs: number = 5000
    ): Promise<ExecutionResult> {
        const startTime = Date.now();
        const container = this.getContainerForLanguage(language);
        
        if (!container) {
            return {
                success: false,
                output: '',
                error: `Lenguaje no soportado: ${language}`,
                exitCode: -1,
                timeMs: Date.now() - startTime
            };
        }

        try {
            // Crear archivo temporal con el código
            const ext = this.getFileExtension(language);
            const fileName = `submission_${submissionId}${ext}`;
            const filePath = path.join(this.tempDir, fileName);
            fs.writeFileSync(filePath, code);

            // Construir comando Docker
            const dockerCmd = this.buildDockerCommand(
                container,
                filePath,
                language,
                submissionId
            );

            console.log(`🐳 Ejecutando en Docker: ${dockerCmd}`);

            // Ejecutar con timeout
            const output = await this.executeWithTimeout(
                dockerCmd,
                timeoutMs
            );

            // Limpiar archivo temporal
            fs.unlinkSync(filePath);

            return {
                success: true,
                output,
                exitCode: 0,
                timeMs: Date.now() - startTime
            };

        } catch (error: any) {
            return {
                success: false,
                output: error.stdout || '',
                error: error.message || String(error),
                exitCode: error.status || -1,
                timeMs: Date.now() - startTime
            };
        }
    }

    /**
     * Obtiene la imagen Docker según el lenguaje
     */
    private getContainerForLanguage(language: string): string | null {
        const containers: { [key: string]: string } = {
            'cpp': 'gcc:latest',
            'c++': 'gcc:latest',
            'python': 'python:3.11-slim',
            'py': 'python:3.11-slim',
            'javascript': 'node:20-alpine',
            'js': 'node:20-alpine',
            'java': 'openjdk:21-slim',
            'go': 'golang:1.21-alpine',
        };
        return containers[language.toLowerCase()] || null;
    }

    /**
     * Obtiene la extensión de archivo según el lenguaje
     */
    private getFileExtension(language: string): string {
        const extensions: { [key: string]: string } = {
            'cpp': '.cpp',
            'c++': '.cpp',
            'python': '.py',
            'py': '.py',
            'javascript': '.js',
            'js': '.js',
            'java': '.java',
            'go': '.go',
        };
        return extensions[language.toLowerCase()] || '.txt';
    }

    /**
     * Construye el comando Docker según el lenguaje
     */
    private buildDockerCommand(
        container: string,
        filePath: string,
        language: string,
        submissionId: string
    ): string {
        const lang = language.toLowerCase();
        const fileName = path.basename(filePath);
        const tempDir = this.tempDir;

        // Mapeo de comandos de ejecución por lenguaje
        if (lang === 'cpp' || lang === 'c++') {
            return `docker run --rm -v ${tempDir}:/workspace ${container} bash -c "cd /workspace && g++ -o output ${fileName} && ./output"`;
        } else if (lang === 'python' || lang === 'py') {
            return `docker run --rm -v ${tempDir}:/workspace ${container} python /workspace/${fileName}`;
        } else if (lang === 'javascript' || lang === 'js') {
            return `docker run --rm -v ${tempDir}:/workspace ${container} node /workspace/${fileName}`;
        } else if (lang === 'java') {
            // Para Java necesitamos compilar y ejecutar
            return `docker run --rm -v ${tempDir}:/workspace ${container} bash -c "cd /workspace && javac ${fileName} && java Main"`;
        } else if (lang === 'go') {
            return `docker run --rm -v ${tempDir}:/workspace ${container} bash -c "cd /workspace && go run ${fileName}"`;
        }

        return `docker run --rm -v ${tempDir}:/workspace ${container} /workspace/${fileName}`;
    }

    /**
     * Ejecuta un comando con timeout
     */
    private executeWithTimeout(
        command: string,
        timeoutMs: number
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error(`Timeout: Ejecución superó ${timeoutMs}ms`));
            }, timeoutMs);

            try {
                const output = execSync(command, {
                    encoding: 'utf-8',
                    stdio: ['pipe', 'pipe', 'pipe'],
                    maxBuffer: 10 * 1024 * 1024 // 10MB
                });
                clearTimeout(timeout);
                resolve(output);
            } catch (error: any) {
                clearTimeout(timeout);
                reject(error);
            }
        });
    }

    /**
     * Limpia archivos temporales
     */
    async cleanup(submissionId: string): Promise<void> {
        const pattern = `submission_${submissionId}`;
        const files = fs.readdirSync(this.tempDir);
        
        for (const file of files) {
            if (file.includes(pattern)) {
                const filePath = path.join(this.tempDir, file);
                try {
                    fs.unlinkSync(filePath);
                } catch (error) {
                    console.error(`Error limpiando ${filePath}:`, error);
                }
            }
        }
    }
}
