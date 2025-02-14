export interface Missive {
  state: {
    conversations?: { length: number }[];
  };
  comment: (url: string) => void;
  createConversation: (options: { select: boolean; count: number }) => void;
  openSelf: () => void;
  reply: (options: { mailto: { body: string } }) => void;
  openForm: (options: {
    name: string;
    fields: Array<{
      type: string;
      data: {
        name: string;
        value: string;
        placeholder?: string;
        focus?: boolean;
      };
    }>;
    buttons: Array<{
      type: string;
      label: string;
    }>;
  }) => Promise<{ search?: string }>;
  setActions: (
    actions: Array<{
      contexts: string[];
      label: string;
      callback: () => void | Promise<void>;
    }>
  ) => void;
  on: (
    event: "main_action" | "change:conversations",
    callback: (event: unknown) => void
  ) => void;
  closeSelf: () => void;
}

declare global {
  const Missive: Missive;
}

export {};
