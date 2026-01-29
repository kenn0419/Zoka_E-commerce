import * as crypto from 'crypto';

export function signMomoRequest(raw: string, secretKey: string): string {
  return crypto.createHmac('sha256', secretKey).update(raw).digest('hex');
}

export function verifyMomoIpnSignature(body: any, secretKey: string): boolean {
  const rawSignature =
    `accessKey=${process.env.MOMO_ACCESS_KEY}` +
    `&amount=${body.amount}` +
    `&extraData=${body.extraData}` +
    `&orderId=${body.orderId}` +
    `&orderInfo=${body.orderInfo}` +
    `&orderType=${body.orderType}` +
    `&partnerCode=${body.partnerCode}` +
    `&payType=${body.payType}` +
    `&requestId=${body.requestId}` +
    `&responseTime=${body.responseTime}` +
    `&resultCode=${body.resultCode}`;

  const expectedSignature = signMomoRequest(rawSignature, secretKey);
  return expectedSignature === body.signature;
}
