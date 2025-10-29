import { Worker } from 'bullmq';
import axios from 'axios';
import { S3Service } from '../infrastructure/s3.service';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const s3Service = new S3Service();

const worker = new Worker(
    'submissions',
    async (job) => {
        console.log(`\n🔄 Procesando job ${job.id}...`);
        console.log('Data:', job.data);

        const { submissionId, codeUrl } = job.data;

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
            
            console.log('✅ Código descargado:');
            console.log(code);

            // 3. Crear archivo temporal
            const tempDir = path.join(__dirname, '../temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }
            
            const fileExt = path.extname(key);
            const tempFile = path.join(tempDir, `${submissionId}${fileExt}`);
            fs.writeFileSync(tempFile, code);
            console.log(`📝 Archivo temporal creado: ${tempFile}`);

            // 4. Ejecutar el código (ejemplo simple para CPP/Python/JS)
            console.log('⚙️ Ejecutando código...');
            // Aquí iría tu lógica de ejecución
            // Por ahora solo mostramos que se descargó

            // 5. Limpiar
            fs.unlinkSync(tempFile);
            console.log('🧹 Archivo temporal eliminado');

            return {
                success: true,
                submissionId,
                message: 'Código procesado exitosamente'
            };

        } catch (error) {
            console.error('❌ Error procesando job:', error);
            throw error;
        }
    },
    {
        connection: {
            host: 'localhost', // Redis en Docker expuesto en 6380:6379
            port: 6380, // Puerto local donde Redis está expuesto
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
