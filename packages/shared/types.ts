declare module 'remult' {
  export interface UserInfo {
    session: {
      id: string;
      expiresAt: Date;
      twoFactorVerified: boolean;
    };
  }

  export interface FieldOptions<entityType, valueType> {
    placeholderText?: string;
  }
}

export type { UserInfo, FieldOptions } from 'remult';
