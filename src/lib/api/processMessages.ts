import { toast } from 'sonner';

import { TServiceMessage } from '@/shared/types/api';

// Track displayed messages to prevent duplicates in Strict Mode
const displayedMessages = new Set<string>();

/** Process service messages - display toasts based on message type */
export function processMessages(messages: TServiceMessage[]): void {
  messages.forEach((message) => {
    const { type, message: text } = message;
    const messageKey = `${type}:${text}`;
    // Skip if already displayed recently
    if (displayedMessages.has(messageKey)) {
      return;
    }
    // Mark as displayed and auto-remove after duration
    displayedMessages.add(messageKey);
    setTimeout(() => displayedMessages.delete(messageKey), 1000);
    switch (type) {
      case 'success':
        toast.success(text);
        break;
      case 'error':
        toast.error(text);
        break;
      case 'warning':
        toast.warning(text);
        break;
      case 'info':
        toast.info(text);
        break;
      default:
        toast(text);
    }
  });
}
