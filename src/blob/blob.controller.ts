import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { BlobService } from './blob.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminRoleGuard } from '../auth/guard/admin.role.guard';
@Controller('blob')
export class BlobController {
    private allowedFormats = ['.jpg', '.jpeg', '.png', '.gif'];
    constructor(private readonly blobService: BlobService) { }

    @UseGuards(AdminRoleGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('image',{
        limits: {
            fileSize: 10 * 1024 * 1024, // 10 MB
        },
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {

        const fileExtension = file.originalname.toLowerCase().split('.').pop();

        if (!this.allowedFormats.includes(`.${fileExtension}`)) {
            throw new BadRequestException('Invalid file format. Only image files are allowed.');
        }
        const url = await this.blobService.uploadFile(file);
        return {
            url: url.url,
            message: 'File uploaded successfully',
            status: 200
        }
    }
}
