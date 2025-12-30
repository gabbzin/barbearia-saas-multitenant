import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { CSSProperties } from "react";

interface TemplateEmailPageProps {
  barbershopName: string;
}

export default function TemplateEmailPage({
  barbershopName = "Apartus",
}: TemplateEmailPageProps) {
  const year = new Date().getFullYear();
  const baseUrl =
    process.env.BLOB_PUBLIC_BASE_URL ??
    "https://tp9a32tu7d1qyqaz.public.blob.vercel-storage.com";

  const baseHostUrl =
    process.env.NEXT_PUBLIC_BASE_HOST_URL ?? "http://localhost:3000";

  return (
    <Html>
      <Head />
      <Preview>Recuperar sua senha</Preview>

      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/templates-assets/backgroundMail.jpg`}
            alt="Head"
            width="600"
            style={image}
          />

          <Hr style={hr} />

          <Section style={box}>
            <Heading as="h1" style={heading}>
              Recuperar Senha
            </Heading>

            <Text style={paragraph}>
              Para realizar a recuperação de senha, pedimos que você clique no
              link abaixo.
            </Text>

            <Button style={button} href={`${baseHostUrl}/reset-password`}>
              Redefinir Senha
            </Button>
          </Section>

          <Hr style={hr} />

          <Section style={footerBox}>
            <Img
              src={`${baseUrl}/templates-assets/closed.png`}
              alt="closed"
              width="200"
              style={image}
            />

            <Text style={footerText}>
              © {year} {barbershopName}
            </Text>

            <Text style={footer}>Todos os direitos reservados.</Text>

            <Img
              src={`${baseUrl}/templates-assets/divider_down.png`}
              alt="divider"
              width="600"
              style={image}
            />
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main: CSSProperties = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: "20px 0",
};

const container: CSSProperties = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "600px",
  width: "100%",
};

const box: CSSProperties = {
  padding: "0 24px",
};

const footerBox: CSSProperties = {
  padding: "24px",
  textAlign: "center",
  backgroundColor: "#000",
};

const image: CSSProperties = {
  maxWidth: "100%",
  height: "auto",
  display: "block",
  margin: "0 auto",
};

const hr: CSSProperties = {
  borderColor: "#e6ebf1",
  margin: "24px 0",
};

const heading: CSSProperties = {
  fontSize: "22px",
  marginBottom: "12px",
  textAlign: "center",
};

const paragraph: CSSProperties = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "center",
};

const button: CSSProperties = {
  backgroundColor: "#656ee8",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  display: "block",
  width: "100%",
  padding: "12px 0",
  textAlign: "center",
  marginTop: "20px",
};

const footerText: CSSProperties = {
  color: "#ffffff",
  fontSize: "14px",
  marginTop: "12px",
};

const footer: CSSProperties = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
