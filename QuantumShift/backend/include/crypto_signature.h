#ifndef CRYPTO_SIGNATURE_H
#define CRYPTO_SIGNATURE_H

#include <stddef.h>

typedef struct
{
    int success;
    int original_valid;
    int tampered_valid;

    size_t signature_size;

    double keygen_ms;
    double sign_ms;
    double verify_ms;

} MLDSAResult;

int run_ml_dsa(MLDSAResult *out);
int run_ml_dsa_demo(void);

#endif