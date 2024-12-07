import { RemultContext } from 'remult';

declare module 'remult' {
  export interface UserInfo {
    email: string;
    avatar?: string;
    session: {
      id: string;
      expiresAt: Date;
      twoFactorVerified: boolean;
    };
  }

  export interface FieldOptions<entityType, valueType> {
    placeholderText?: string;
  }
  export interface Remult {
    readonly context: RemultContext;
  }
}

export type { UserInfo, FieldOptions } from 'remult';
