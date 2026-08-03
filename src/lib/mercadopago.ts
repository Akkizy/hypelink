import { MercadoPagoConfig, Payment, PreApproval } from "mercadopago";

function getClient() {
  return new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });
}

export function getPaymentClient() {
  return new Payment(getClient());
}

export function getPreApprovalClient() {
  return new PreApproval(getClient());
}

export const PRO_PLAN_PRICE_BRL = 19.9;
