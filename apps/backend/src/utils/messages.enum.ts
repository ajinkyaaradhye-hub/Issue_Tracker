export enum MessagesEnum {
  // ✅ Generic
  UNKNOWN_ERROR = 'An unexpected error occurred',
  LOGIN_ERROR = 'Login error:',
  REGISTER_ERROR = 'Register error:',

  // ✅ Auth specific
  USER_ALREADY_EXISTS = 'User already exists',
  USER_NOT_FOUND = 'User not found',
  INVALID_CREDENTIALS = 'Invalid email or password',
  USER_REGISTERED_SUCCESS = 'User registered successfully',
  LOGIN_SUCCESS = 'Login successful',

  // ✅ Tokens
  TOKEN_MISSING = 'Access token missing',
  TOKEN_INVALID = 'Invalid or expired token',
  TOKEN_REFRESHED = 'Access token refreshed successfully',

  // ✅ Authorization
  FORBIDDEN = 'You are not authorized to access this resource',

  // ✅ Routes
  ADMIN_ONLY_ROUTE = 'This is an admin-only route',
}

export enum AppMessages {
  USER_EXISTS = 'User already exists',
  INVALID_CREDENTIALS = 'Invalid email or password',
  USER_CREATED = 'User registered successfully',
  LOGIN_SUCCESS = 'Login successful',

  ISSUE_CREATED = 'Issue created successfully',
  ISSUE_UPDATED = 'Issue updated successfully',
  ISSUE_DELETED = 'Issue deleted successfully',
  ISSUE_NOT_FOUND = 'Issue not found',
}
