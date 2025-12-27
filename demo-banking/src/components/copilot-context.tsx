"use client";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useAuthContext } from "@/components/auth-context";
import { Button } from "./ui/button";

export enum Page {
  Cards = "cards",
  Team = "team",
}

export enum CardsPageOperations {
  ChangePin = "change-pin",
}

export enum TeamPageOperations {
  InviteMember = "invite-member",
  RemoveMember = "remove-member",
  EditMember = "edit-member",
}

export const AVAILABLE_OPERATIONS_PER_PAGE = {
  [Page.Cards]: Object.values(CardsPageOperations),
  [Page.Team]: Object.values(TeamPageOperations),
};

// A component dedicated to adding readables/actions that are global to the app.
const CopilotContext = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuthContext();

  // A readable of app wide authentication and authorization context.
  // The LLM will now know which user is it working against, when performing operations.
  // Given the respective authorization role, the LLM will allow/deny actions/information throughout the entire app.
  useCopilotReadable({
    description: "The current user logged into the system",
    value: currentUser,
  });

  useCopilotReadable({
    description:
      "The available pages and operations, as well as the current page",
    value: {
      pages: Object.values(Page),
      operations: AVAILABLE_OPERATIONS_PER_PAGE,
      currentPage: window.location.pathname.split("/").pop() as Page,
    },
  });

  // This action is a generic "fits all" action
  // It's meant to allow the LLM to navigate to a page where an operation is available or probably available, and possibly activate the operation there.
  // It is tired to the readable above, and requires that operations are implemented in their respective pages.
  // The LLM here will redirect the user to a different page, and set an `operation` query param to notify the page of the requested action
  // For example, you can find `change-pin` in the cards page, which is activated when `operation=change-pin` query param is sent
  useCopilotAction({
    name: "navigateToPageAndPerform",
    description: `
            Navegue para uma página para executar uma ação. Use isto se pedirem uma ação fora do contexto da página. Exemplo:
            O usuário está no dashboard, mas pediu para alterar um membro do time ou um cartão.
            
            Se você estiver na página de cartões e pedirem uma ação de cartão, você pode executar.
            
            Se a ação não estiver disponível, peça para o usuário navegar até a página correta.
            Informe qual é a página.
            Peça para solicitar novamente ao copiloto quando chegar lá.
            Você pode sugerir que faz a navegação por ele.
            Exemplo: "Adicionar novo cartão não está disponível nesta página. Vá para 'Cartões' e peça de novo. Quer que eu te leve até lá?"
            
            Caso contrário, inicie a navegação sem perguntar.
        `,
    parameters: [
      {
        name: "page",
        type: "string",
        description: "The page in which to perform the operation",
        required: true,
        enum: ["/cards", "/team", "/"],
      },
      {
        name: "operation",
        type: "string",
        description:
          "The operation to perform. Use operation code from available operations per page. If the operation is unavailable, do not pass it",
        required: false,
      },
      {
        name: "operationAvailable",
        type: "boolean",
        description: "Flag if the operation is available",
        required: true,
      },
    ],
    followUp: false,
    renderAndWait: ({ args, handler }) => {
      const { page, operation, operationAvailable } = args;

      return (
        <div className="flex items-center justify-center space-x-4 rounded-lg bg-black p-4 text-slate-100">
          <div>Deseja navegar para {page}?</div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const operationParams = `?operation=${operation}`;
              window.location.href = `${page!.toLowerCase()}${
                operationAvailable ? operationParams : ""
              }`;
              handler?.(page!);
            }}
            aria-label="Confirmar navegação"
            className="h-12 w-12 rounded-full bg-black text-emerald-200 hover:bg-neutral-900 hover:text-emerald-100"
          >
            Sim
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handler?.("cancelled")}
            aria-label="Cancelar navegação"
            className="h-12 w-12 rounded-full bg-black text-neutral-200 hover:bg-neutral-900 hover:text-white"
          >
            Não
          </Button>
        </div>
      );
    },
  });

  return children;
};

export default CopilotContext;
