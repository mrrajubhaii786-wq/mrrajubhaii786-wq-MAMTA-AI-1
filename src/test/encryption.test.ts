import { describe, it, expect } from 'vitest';
import { encryptValue, decryptValue, verifyMasterPassword } from '../db/fileDb';

describe('Encryption', () => {
  const password = 'TestP@ssw0rd!2026';
  const secret = 'my-api-key-12345';

  it('encrypts and decrypts', () => {
    const encrypted = encryptValue(secret, password);
    const decrypted = decryptValue(encrypted, password);
    expect(decrypted).toBe(secret);
  });

  it('produces different ciphertexts', () => {
    const enc1 = encryptValue(secret, password);
    const enc2 = encryptValue(secret, password);
    expect(enc1).not.toBe(enc2);
  });

  it('rejects wrong password', () => {
    const encrypted = encryptValue(secret, password);
    expect(() => decryptValue(encrypted, 'wrong')).toThrow();
  });

  it('verifies correct password', () => {
    const encrypted = encryptValue(secret, password);
    expect(verifyMasterPassword(encrypted, password)).toBe(true);
  });

  it('fails wrong password verification', () => {
    const encrypted = encryptValue(secret, password);
    expect(verifyMasterPassword(encrypted, 'wrong')).toBe(false);
  });
});
