"use client";

import { useEffect, useReducer } from "react";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import {
  CARD_COLORS,
  NewCardRequest,
  Transaction,
} from "@/app/api/v1/data";
import { CreditCardDetails } from "@/components/credit-card-details";
import { PartialBy } from "@/lib/type-helpers";
import {
  filterTransactionByTitle,
  filterTransactionsByCardLast4,
  filterTransactionsByPolicyId,
  randomDigits,
} from "@/lib/utils";
import useCreditCards from "@/app/actions";
import { useAuthContext } from "@/components/auth-context";
import { AddCardDropdown } from "@/components/add-card-dropdown";
import { TransactionsList } from "@/components/transactions-list";
import { ChangePinDialog } from "@/components/change-pin-dialog";
import { useSearchParams } from "next/navigation";
import { CardsPageOperations } from "@/components/copilot-context";
import { useCopilotChatSuggestions } from "@copilotkit/react-ui";
import { PERMISSIONS } from "@/app/api/v1/permissions";

interface ChangePinState {
  newPin: string;
  dialogOpen: boolean;
  cardId: string | null;
  loading: boolean;
}

export default function Page() {
  const { currentUser } = useAuthContext();
  const searchParams = useSearchParams();
  const operation = searchParams.get("operation") as CardsPageOperations | null;
  const [state, dispatch] = useReducer<
    React.Reducer<ChangePinState, Partial<ChangePinState>>
  >(
    (state: ChangePinState, payload: Partial<ChangePinState>) => ({
      ...state,
      ...payload,
    }),
    { newPin: "", dialogOpen: false, cardId: null, loading: false }
  );
  const {
    cards,
    policies,
    transactions,
    addNewCard,
    changePin,
    assignPolicyToCard,
    addNoteToTransaction,
    changeTransactionStatus,
  } = useCreditCards();

  useEffect(() => {
    const operationNameToMethod: Partial<
      Record<CardsPageOperations, () => void>
    > = {
      [CardsPageOperations.ChangePin]: () => dispatch({ dialogOpen: true }),
    };

    if (!operation || !Object.values(CardsPageOperations).includes(operation))
      return;
    operationNameToMethod[operation]?.();
  }, [operation]);

  const handleChangePinSubmit = async ({
    pin,
    cardId,
  }: {
    pin?: string;
    cardId?: string;
  }) => {
    dispatch({ loading: true });
    await changePin({
      pin: pin ?? state.newPin,
      cardId: cardId ?? state.cardId!,
    });
    dispatch({ loading: false, newPin: "", cardId: null, dialogOpen: false });
  };

  const handleAddCard = async (
    cardRequest: PartialBy<NewCardRequest, "color" | "pin">
  ) => {
    void addNewCard({
      ...cardRequest,
      color: CARD_COLORS[cardRequest.type],
      pin: randomDigits(4).toString(),
    });
  };

  // Enable add new card with co pilot
  useCopilotAction({
    name: "addNewCard",
    description: "Adicionar novo cartão de crédito",
    disabled: !PERMISSIONS.ADD_CARD.includes(currentUser.role),
    parameters: [
      {
        name: "type",
        type: "string",
        description: "O tipo do cartão (definido pelo usuário): Visa ou Mastercard",
        required: true,
      },
      {
        name: "color",
        type: "string",
        description:
          "A cor do cartão (gerada pelo copilot): bg-blue-500 para Visa, bg-red-500 para Mastercard",
        required: true,
      },
      {
        name: "pin",
        type: "string",
        description: "O PIN do cartão (definido pelo usuário), 4 dígitos",
        required: true,
      },
    ],
    handler: async ({ type, color, pin }) => {
      await addNewCard({ type, color, pin } as NewCardRequest);
    },
  });

  useCopilotAction({
    name: "assignPolicyToCard",
    description: "Vincular uma policy a um cartão",
    disabled: !PERMISSIONS.ADD_POLICY.includes(currentUser.role),
    parameters: [
      {
        name: "cardId",
        type: "string",
        description: "O cartão (existente) que receberá a policy",
        required: true,
      },
      {
        name: "policyType",
        type: "string",
        description: "O tipo da policy a usar",
        required: true,
      },
    ],
    handler: async ({ cardId, policyType }) => {
      const policyId = policies.find(
        (policy) => policy.type === policyType
      )?.id;
      if (!policyId)
        throw new Error("Could not find matching policy to assign");
      await assignPolicyToCard({ cardId, policyId });
    },
  });

  useCopilotAction({
    name: "addNoteToTransaction",
    description: "Adicionar observação à transação",
    disabled: !PERMISSIONS.ADD_NOTE.includes(currentUser.role),
    parameters: [
      {
        name: "transactionId",
        type: "string",
        description: "A transação que receberá a observação (ID fornecido pelo copilot)",
        required: true,
      },
      {
        name: "content",
        type: "string",
        description: "O conteúdo da observação",
        required: true,
      },
    ],
    handler: addNoteToTransaction,
  });

  // Showcase usage of generative UI. The only co pilot related that's not in actions, due to usage of TSX
  useCopilotAction({
    name: "showTransactions",
    description:
      "Exibe uma lista de transações sob demanda. É necessário ao menos um parâmetro",
    disabled: !PERMISSIONS.SHOW_TRANSACTIONS.includes(currentUser.role),
    followUp: false,
    parameters: [
      {
        name: "card4Digits",
        type: "string",
        description: "os últimos 4 dígitos do cartão",
        required: false,
      },
      {
        name: "policyId",
        type: "string",
        description: "o id da policy (identificado pelo copilot)",
        required: false,
      },
      {
        name: "transactionTitle",
        type: "string",
        description: "o título da transação",
        required: false,
      },
    ],
    handler: async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    },
    render: ({ status, args }) => {
      const { card4Digits, policyId, transactionTitle } = args;

      let filteredTransactions = transactions;
      if (card4Digits) {
        filteredTransactions = filterTransactionsByCardLast4(
          transactions,
          cards,
          card4Digits
        );
      } else if (policyId) {
        filteredTransactions = filterTransactionsByPolicyId(
          transactions,
          policyId
        );
      } else if (transactionTitle) {
        filteredTransactions = filterTransactionByTitle(
          transactions,
          transactionTitle
        );
      }

      if (status === "inProgress") {
        return "Carregando...";
      } else if (!filteredTransactions) {
        return "Problema ao buscar transações";
      } else {
        return <TransactionsList transactions={filteredTransactions} compact />;
      }
    },
  });

  // Enable pin changing with co pilot
  useCopilotAction({
    name: "setCardPin",
    description: "Definir o PIN de um cartão existente",
    disabled: !PERMISSIONS.SET_PIN.includes(currentUser.role),
    parameters: [
      {
        name: "cardId",
        type: "string",
        description: "O id do cartão (fornecido pelo copilot)",
        required: true,
      },
    ],
    handler: async ({ cardId }) => {
      dispatch({ dialogOpen: true, cardId });
    },
  });

  useCopilotAction({
    name: "showAndApproveTransactions",
    description: `
      Esta operação é por departamento.
      Um admin do departamento executivo pode aprovar/negar de outros departamentos também.
      
      Mostre as transações não aprovadas e permita que o admin do departamento aprove.
      
      As transações serão apresentadas uma a uma.
    `,
    disabled: !PERMISSIONS.APPROVE_TRANSACTION.includes(currentUser.role),
    parameters: [
      {
        name: "transactionId",
        type: "string",
        description:
          "O id da transação pendente para apresentar ao admin do departamento (fornecido pelo copilot)",
        required: true,
      },
    ],
    renderAndWait: ({ args, handler, status }) => {
      const { transactionId } = args;
      if (status === "inProgress") {
        return <div>Carregando...</div>;
      }

      if (!transactionId) {
        handler?.(
          "Nenhum ID de transação foi informado. Pode não haver pendências ou ocorreu um erro."
        );
        return <div>Sem transações pendentes</div>;
      }

      async function handleChangeTransactionStatus({
        id,
        status,
      }: {
        id: string;
        status: Transaction["status"];
      }) {
        await changeTransactionStatus({ id, status });
        handler?.(`transação ${id} ${status}`);
      }

      return (
        <TransactionsList
          transactions={transactions.filter((t) =>
            transactionId.includes(t.id)
          )}
          showApprovalInterface
          approvalInterfaceProps={{
            onApprove: (transactionId) =>
              handleChangeTransactionStatus({
                id: transactionId,
                status: "approved",
              }),
            onDeny: (transactionId) =>
              handleChangeTransactionStatus({
                id: transactionId,
                status: "denied",
              }),
          }}
        />
      );
    },
  });

  useCopilotReadable({
    description:
      "O usuário não tem permissão para executar estas ações." +
      "Se ele pedir alguma delas, informe que não possui permissão." +
      "Não diga que está na página errada; o motivo real é falta de permissão.",
    value: Object.keys(PERMISSIONS).filter(
      (key) =>
        !PERMISSIONS[key as keyof typeof PERMISSIONS].includes(currentUser.role)
    ),
  });

  // useCopilotReadable({
  //   description: "The user has access to the following documents",
  //   value: PERMISSIONS.READ_MSA.includes(currentUser.role) ? [FEDEX_MSA] : [],
  // });

  

  if (!cards || !policies) return null;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Credit Cards</h1>
        <AddCardDropdown
          handleAddCard={handleAddCard}
          currentUser={currentUser}
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.length ? (
          cards.map((card) => (
            <CreditCardDetails
              key={card.id}
              card={card}
              policy={policies.find((p) => p.id === card.expensePolicyId)}
              onChangePinModalOpen={() =>
                dispatch({ dialogOpen: true, cardId: card.id })
              }
            />
          ))
        ) : (
          <div>No cards found for {currentUser.team} team</div>
        )}
      </div>

      <ChangePinDialog
        dialogOpen={state.dialogOpen}
        onSubmit={({ pin, cardId }) => handleChangePinSubmit({ pin, cardId })}
        loading={state.loading}
        onDialogOpenChange={(open) => dispatch({ dialogOpen: open })}
        cards={cards}
      />
    </div>
  );
}
