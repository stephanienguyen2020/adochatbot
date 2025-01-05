"use client";

import { Message } from "./Message";
import type { MessageProps } from "./Message";

export function MessageWrapper(props: MessageProps) {
  return <Message {...props} />;
}
