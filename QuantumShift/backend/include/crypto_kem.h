#ifndef CRYPTO_KEM_H
#define CRYPTO_KEM_H

#include "platform_compat.h"

#include <stddef.h>

typedef struct
{
    int success;

    size_t ciphertext_size;
    size_t shared_secret_size;

    double keygen_ms;
    double encapsulation_ms;
    double decapsulation_ms;

} MLKEMResult;

int run_ml_kem(MLKEMResult *out);
int run_ml_kem_demo(void);

#endif