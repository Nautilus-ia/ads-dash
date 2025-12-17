export enum CardBrand {
  Visa = "Visa",
  MasterCard = "MasterCard",
}

export const CARD_COLORS = {
  [CardBrand.Visa]: "bg-blue-500",
  [CardBrand.MasterCard]: "bg-red-500",
};

export interface Card {
  id: string;
  last4: string;
  expiry: string;
  type: CardBrand;
  color: string;
  pin: string;
  expensePolicyId?: string;
}

export enum MemberRole {
  Admin = "Admin",
  Assistant = "Assistant",
  Member = "Member",
}

export enum ExpenseRole {
  Marketing = "Marketing",
  Engineering = "Engineering",
  Executive = "Executive",
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  team: ExpenseRole;
}

export interface ExpensePolicy {
  id: string;
  type: ExpenseRole;
  limit: number;
  spent: number;
}

export interface TransactionNote {
  content: string;
  userId: string;
  date: string;
}

export interface Transaction {
  id: string;
  title: string;
  note?: TransactionNote;
  amount: number;
  date: string;
  policyId: string;
  cardId: string;
  status: "pending" | "denied" | "approved";
}

export interface NewCardRequest {
  type: CardBrand;
  color: string;
  pin: string;
}

export function generateUniqueId() {
  return Math.random().toString(36).substring(2, 15);
}

export const data: {
  cards: Card[];
  team: Member[];
  policies: ExpensePolicy[];
  transactions: Transaction[];
} = {
  cards: [
    {
      id: "5tf3rmlcyg3",
      last4: "4242",
      expiry: "12/26",
      type: CardBrand.Visa,
      color: CARD_COLORS[CardBrand.Visa],
      pin: "1234",
      expensePolicyId: "8r5c3m4n5o",
    },
    {
      id: "wr197z5ilg",
      last4: "1234",
      expiry: "10/25",
      type: CardBrand.MasterCard,
      color: CARD_COLORS[CardBrand.MasterCard],
      pin: "5678",
      expensePolicyId: "7f3b3c4d5e",
    },
    {
      id: "fA5b7c6d5e",
      last4: "5555",
      expiry: "01/27",
      type: CardBrand.Visa,
      color: CARD_COLORS[CardBrand.Visa],
      pin: "9101",
      expensePolicyId: "9a8b7c6d5e",
    },
  ],
  policies: [
    { id: "7f3b3c4d5e", type: ExpenseRole.Marketing, limit: 1000, spent: 315 },
    {
      id: "8r5c3m4n5o",
      type: ExpenseRole.Executive,
      limit: 1500,
      spent: 390,
    },
    {
      id: "9a8b7c6d5e",
      type: ExpenseRole.Engineering,
      limit: 2000,
      spent: 345,
    },
  ],
  team: [
    {
      id: "9g5h2j1k4l",
      name: "Seu Nome",
      email: "felipe.Nemo@banco.com.br",
      role: MemberRole.Admin,
      team: ExpenseRole.Executive,
    },
    {
      id: "1a2b3c4d5e",
      name: "Ana Souza",
      email: "ana.souza@banco.com.br",
      role: MemberRole.Admin,
      team: ExpenseRole.Marketing,
    },
    {
      id: "2b3c4d5e6f",
      name: "Lucas Oliveira",
      email: "lucas.oliveira@banco.com.br",
      role: MemberRole.Member,
      team: ExpenseRole.Engineering,
    }
  ],
  transactions: [
    {
      id: "t-1",
      title: "Railway App",
      amount: -315.00,
      date: "2025-11-01",
      policyId: "7f3b3c4d5e",
      cardId: "wr197z5ilg",
      status: "approved",
    },
    {
      id: "t-2",
      title: "Magalu Cloud",
      amount: -345.50,
      date: "2025-11-05",
      policyId: "9a8b7c6d5e",
      cardId: "fA5b7c6d5e",
      status: "approved",
    },
    {
      id: "t-3",
      title: "Railway Database",
      amount: -390.00,
      date: "2025-11-10",
      policyId: "8r5c3m4n5o",
      cardId: "5tf3rmlcyg3",
      status: "pending",
    },
  ],
};