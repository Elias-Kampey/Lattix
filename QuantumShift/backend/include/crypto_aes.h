#ifndef CRYPTO_AES_H
#define CRYPTO_AES_H

#include "platform_compat.h"

typedef struct
{
    int success;
    int plaintext_match;
    int tamper_rejected;

    int plaintext_size;
    int ciphertext_size;
    int tag_size;

    double encrypt_ms;
    double decrypt_ms;

} AESGCMResult;

int run_aes_gcm(AESGCMResult *out);
int run_aes_gcm_demo(void);

#endif