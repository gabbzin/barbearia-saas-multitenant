"use server";

import { NextResponse } from "next/server";
import TemplateEmailRecoverPass from "@/emails/recover-password-email";
import { resendClient } from "../resend-client";

interface SendVerificationEmailParams {
  to: string[];
  userName?: string;
  token: string;
  barberShopSlug: string;
}

export async function sendRecoveryEmail({
  to,
  userName,
  token,
  barberShopSlug,
}: SendVerificationEmailParams) {
  try {
    if (!to || !token) {
      return NextResponse.json(
        { error: "Email and token are required." },
        { status: 400 },
      );
    }

    const { data, error } = await resendClient.emails.send({
      from: "Barbearia <onboarding@resend.dev>",
      to,
      subject: "Recuperação de senha - Barbearia SaaS",
      react: TemplateEmailRecoverPass({
        barbershopName: "Barbearia SaaS",
        userName,
        token,
        barberShopSlug,
      }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
