export enum Role {
  EMPLOYEE = 'EMPLOYEE',
  DIRECTOR = 'DIRECTOR',
  ACCOUNTS = 'ACCOUNTS',
}

export enum VoucherStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export const EXPENSE_CATEGORIES = [
  'Travel & Conveyance',
  'Meals & Entertainment',
  'Office Supplies',
  'Software & Subscriptions',
  'Hardware & Equipment',
  'Utilities & Bills',
  'Training & Certifications',
  'Miscellaneous',
] as const;

export const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Finance & Accounts',
  'Human Resources',
  'Sales & Marketing',
  'Operations',
  'Executive',
] as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;
