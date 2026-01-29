import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { PaymentStrategy } from 'src/common/interfaces/payment.interface';
import { signMomoRequest } from './momo.util';

@Injectable()
export class MomoPaymentService implements PaymentStrategy {
  async createPayment({
    orderId,
    amount,
    orderInfo,
  }: {
    orderId: string;
    amount: number;
    orderInfo: string;
  }) {
    const {
      MOMO_PARTNER_CODE,
      MOMO_ACCESS_KEY,
      MOMO_SECRET_KEY,
      MOMO_ENDPOINT,
      MOMO_REDIRECT_URL,
      MOMO_IPN_URL,
    } = process.env;

    if (
      !MOMO_PARTNER_CODE ||
      !MOMO_ACCESS_KEY ||
      !MOMO_SECRET_KEY ||
      !MOMO_ENDPOINT
    ) {
      throw new BadRequestException('Missing MOMO env config');
    }

    const requestId = orderId + new Date().getTime();
    const amountStr = Math.round(amount).toString();
    const requestType = 'payWithMethod';
    const extraData = '';

    const rawSignature =
      `accessKey=${MOMO_ACCESS_KEY}` +
      `&amount=${amountStr}` +
      `&extraData=${extraData}` +
      `&ipnUrl=${MOMO_IPN_URL}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&partnerCode=${MOMO_PARTNER_CODE}` +
      `&redirectUrl=${MOMO_REDIRECT_URL}` +
      `&requestId=${requestId}` +
      `&requestType=${requestType}`;

    const signature = signMomoRequest(rawSignature, MOMO_SECRET_KEY);

    const payload = {
      partnerCode: MOMO_PARTNER_CODE,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId,
      amount: amountStr,
      orderId,
      orderInfo,
      redirectUrl: MOMO_REDIRECT_URL,
      ipnUrl: MOMO_IPN_URL,
      lang: 'vi',
      requestType,
      autoCapture: true,
      extraData,
      signature,
    };

    const { data } = await axios.post(MOMO_ENDPOINT, payload);

    if (data.resultCode !== 0) {
      throw new BadRequestException(data.message);
    }

    return {
      payUrl: data.payUrl,
    };
  }
}
