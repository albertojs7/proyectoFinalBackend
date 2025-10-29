import { BadRequestException } from "@nestjs/common";
import { S3Service } from "../../infrastructure/s3.service";
import { GetPresignedUrlDto } from "../dto/getPresignedUrl.dto";

export class GetPresignedUrlUseCase {
    constructor(private readonly s3Service: S3Service) {}
    async execute(userId: string, fileName: string): Promise<string> {
        const ALLOWED_EXTENSIONS = ['.cpp', '.py', '.js', '.java', '.go']
        const hasValidExt = ALLOWED_EXTENSIONS.some(ext =>
            fileName.toLocaleLowerCase().endsWith(ext)
        )
        if (!hasValidExt) {
            throw new BadRequestException('Invalid file type')
        }

        if (fileName.includes('..') || fileName.includes('/')) {
            throw new BadRequestException('Invalid name')
        }
        if (fileName.length > 50) {
            throw new BadRequestException('name too long')
        }
        if (fileName.trim().length === 0) {
            throw new BadRequestException('name cant be empty')
        }

        const timestamp = Math.floor(Date.now() / 1000)
        const uniqueName = `submissions/${userId}/${timestamp}-${fileName}`
        const presignedUrl = await this.s3Service.getPresignedUrl(uniqueName)

        return presignedUrl
    }
}