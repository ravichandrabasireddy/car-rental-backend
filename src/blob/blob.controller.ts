import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { BlobService } from './blob.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../auth/guard/jwt.guard';
@Controller('blob')
export class BlobController {
    private allowedFormats = ['.jpg', '.jpeg', '.png', '.gif'];
    constructor(private readonly blobService: BlobService) { }

    @UseGuards(JwtGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('image'))
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
