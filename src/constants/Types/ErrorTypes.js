const ERROR_TYPES = {
  ACCESS_FORBIDDEN: 'access_forbidden',
  AUTHENTICATION_ERROR: 'authentication_error',
  API_ERROR: 'api_error',
  ERROR: 'Error',
  INVALID_REQUEST_ERROR: 'invalid_request_error',
  ONGOING_MAINTENANCE: 'ongoing_maintenance',
  RATE_LIMIT_ERROR: 'rate_limit_error',
  SUBSCRIPTION_ERROR: 'subscription_error',
  TYPE_ERROR: 'TypeError',
};

const ERROR_CODES = {
  CUSTOMER_DELETION_FAILED_DUE_TO_CUSTOMER_IS_ATTACHED_TO_INVOICE:
    'customer_deletion_failed_due_customer_is_attached_to_invoice',
  INVALID_OR_MISSING_PARAMETERS: 'invalid_or_missing_parameters',
  LOGIN_FAILED_DUE_INVALID_CREDENTIALS: 'login_failed_due_invalid_credentials',
  LOGIN_FAILED_DUE_INVALID_DATA: 'login_failed_due_invalid_data',
  LOGIN_FAILED_DUE_UNVERIFIED_EMAIL: 'login_failed_due_unverified_email',
  NETWORK_REQUEST_FAILED: 'Network request failed',
  NO_ACTIVE_SUBSCRIPTION: 'no_active_subscription',
  NO_ACTIVE_SUBSCRIPTION_INCLUDING_PHONE_APPLICATION:
    'no_active_subscription_including_phone_application',
  ONGOING_MAINTENANCE: 'ongoing_maintenance',
  PLAN_FEATURE_LIMIT_EXCEEDED: 'plan_feature_limit_exceeded',
  REQUEST_TIMED_OUT: 'Request timed out',
  TOKEN_INVALID: 'token_invalid',
  TOKEN_MISSING: 'token_missing',
};

export {ERROR_TYPES, ERROR_CODES};
