const SUBSCRIBE_URL = "https://sendsay.ru/form/x_1658738343135908/1/";

const ERRORS: Record<string, string> = {
  "error/email/unknownformat": "Некорректный адрес почты",
};

type SubscribeResponse = {
  page?: string;
  errors?: { id?: string }[];
};

export class SubscribeError extends Error {}

// форма подписки из старого фронта: Sendsay ждёт multipart с полем _member_email
export const subscribeEmail = async (email: string) => {
  let data: SubscribeResponse;

  try {
    const body = new FormData();
    body.append("_member_email", email.trim());

    const response = await fetch(SUBSCRIBE_URL, {
      method: "POST",
      headers: { Accept: "application/json" },
      body,
    });
    data = (await response.json()) as SubscribeResponse;
  } catch {
    throw new SubscribeError("Не получилось подписаться. Попробуйте ещё раз.");
  }

  if (data.page) return;

  const id = data.errors?.[0]?.id ?? "";
  throw new SubscribeError(
    ERRORS[id] ?? "Не получилось подписаться. Попробуйте ещё раз.",
  );
};
