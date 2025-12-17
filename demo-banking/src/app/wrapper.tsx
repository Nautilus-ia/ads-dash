"use client";
import { LayoutComponent } from "@/components/layout";
import "./globals.css";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import { CopilotPopup } from "@copilotkit/react-ui";
import CopilotContext from "@/components/copilot-context";
import { useAuthContext } from "@/components/auth-context";

export function CopilotKitWrapper({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuthContext();

  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      showDevConsole={false}
      properties={{
        userRole: currentUser?.role,
      }}
    >
      <LayoutComponent>
        <CopilotContext>{children}</CopilotContext>
      </LayoutComponent>
      <CopilotPopup
        defaultOpen={true}
        instructions={
          "Você é um assistente, responda de maneira clara as informações financeiras presentes"
        }
        labels={{
          title: "Ads assistant",
          initial: "Olá, eu sou o Copilot da plataforma. Como posso ajudar?",
        }}
      />
    </CopilotKit>
  );
}
