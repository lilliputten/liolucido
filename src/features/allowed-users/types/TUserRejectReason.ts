export type TUserRejectReason =
  | 'NO_TELEGRAM_ID' // No telegram id defined
  | 'REJECTED_TELEGRAM_ID' // Wrong telegram id found
  | 'NO_EMAIL' // No email defined
  | 'REJECTED_EMAIL';
