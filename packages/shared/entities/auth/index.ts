import { DeviceKeyData } from './DeviceKeyData';
import { EvrKeyData } from './EvrKeyData';
import { KeychainKeyData } from './KeychainKeyData';
import { OtpKeyData } from './OtpKeyData';
import { PrsKeyData } from './PrsKeyData';
import { Session } from './sessionEntity';
import { Account } from './accountEntity';

export const authEntities = [
  DeviceKeyData,
  EvrKeyData,
  KeychainKeyData,
  OtpKeyData,
  PrsKeyData,
  Session,
  Account
];

export const authEntity = {
  securityKey: DeviceKeyData,
  emailReset: EvrKeyData,
  passkey: KeychainKeyData,
  otp: OtpKeyData,
  passReset: PrsKeyData,
  session: Session,
  user: Account
};

export type TAccount = typeof Account;
