import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PaymentsService } from '../payments.service';

@Processor('payments')
export class PaymentProcessor {
  constructor(private paymentsService: PaymentsService) {}

  @Process('processPayment')
  async handlePaymentProcessing(job: Job<{ paymentId: string }>) {
    const { paymentId } = job.data;
    await this.paymentsService.simulatePayment(paymentId);
  }
}