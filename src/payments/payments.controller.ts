import { Controller, Post , Body, ValidationPipe} from '@nestjs/common';
import { createPaymentDto } from './dto/payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {

    constructor(private readonly paymentsService: PaymentsService) {}

    @Post('create')
    async createPayment(@Body(ValidationPipe) createPaymentDto: createPaymentDto) {
        return this.paymentsService.createPayment(createPaymentDto);
    }

    
}