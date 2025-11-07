import { Worker } from 'bullmq';
import axios from 'axios';
import { S3Service } from '../infrastructure/s3.service';
import { ExecutionService } from '../infrastructure/execution.service';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const s3Service = new S3Service();
const executionService = new ExecutionService();

// Detectar si estamos en Docker o local
// En Docker: REDIS_HOST=redis, REDIS_PORT=6379
// En local: REDIS_HOST=localhost (o vacio), REDIS_PORT=6380
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_HOST ? 6379 : 6380;

console.log(`🔗 Conectando a Redis en ${redisHost}:${redisPort}...`);

const worker = new Worker(
    'submissions',
    async (job) => {
        console.log(`\n🔄 Procesando job ${job.id}...`);
        console.log('Data:', job.data);

        const { submissionId, codeUrl, language, challengeId, userId } = job.data;

        try {
            // 1. Generar presigned URL para descargar
            console.log('📥 Generando presigned URL de descarga...');
            
            // El codeUrl es la ruta del archivo en S3 (ej: "submissions/userId/timestamp-filename.js")
            const key = codeUrl;
            
            if (!key) {
                throw new Error('Invalid codeUrl: key is empty');
            }
            
            const downloadUrl = await s3Service.getPresignedDownloadUrl(key);
            console.log('✅ URL de descarga generada');

            // 2. Descargar el archivo desde S3
            console.log('⬇️ Descargando código desde S3...');
            const response = await axios.get(downloadUrl);
            const code = response.data;
            
            console.log('✅ Código descargado');
            console.log('📄 Contenido:');
            console.log(code);

            // 3. Ejecutar el código en Docker
            console.log(`\n🐳 Ejecutando código ${language}...`);
            const executionResult = await executionService.executeInDocker(
                code,
                language,
                submissionId,
                5000 // 5 segundos de timeout
            );

            console.log(`⏱️ Tiempo de ejecución: ${executionResult.timeMs}ms`);
            console.log(`Exit code: ${executionResult.exitCode}`);
            
            if (executionResult.success) {
                console.log('✅ Código ejecutado exitosamente');
                console.log('📤 Salida:');
                console.log(executionResult.output);
            } else {
                console.log('❌ Error en ejecución:');
                console.log(executionResult.error);
            }

            // 4. Limpiar
            await executionService.cleanup(submissionId);
            console.log('🧹 Archivos limpios');

            return {
                success: executionResult.success,
                submissionId,
                language,
                challengeId,
                output: executionResult.output,
                error: executionResult.error,
                timeMs: executionResult.timeMs,
                exitCode: executionResult.exitCode
            };

        } catch (error) {
            console.error('❌ Error procesando job:', error);
            throw error;
        }
    },
    {
        connection: {
            host: redisHost,
            port: redisPort,
        },
        concurrency: 1, // Procesar un job a la vez
    }
);

worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completado`);
});

worker.on('failed', (job, err) => {
    if (job) {
        console.error(`❌ Job ${job.id} falló:`, err.message);
    } else {
        console.error(`❌ Job falló:`, err.message);
    }
});

console.log('🚀 Worker iniciado, esperando jobs...');
