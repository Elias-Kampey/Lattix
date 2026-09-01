#include <stdio.h>

#include "crypto_kem.h"
#include "crypto_signature.h"
#include "crypto_aes.h"

int main(void)
{
    int result = 0;

    printf("\n======================================\n");
    printf("QuantumShift Backend\n");
    printf("======================================\n\n");

    result = run_ml_kem_demo();

    if (result != 0)
    {
        printf("\nML-KEM test failed.\n");
        return 1;
    }

    printf("\n======================================\n\n");

    result = run_ml_dsa_demo();

    if (result != 0)
    {
        printf("\nML-DSA test failed.\n");
        return 1;
    }

    printf("\n======================================\n\n");

    result = run_aes_gcm_demo();

    if (result != 0)
    {
        printf("\nAES-GCM test failed.\n");
        return 1;
    }

    printf("\n======================================\n");
    printf("All backend tests passed [OK]\n");
    printf("======================================\n");

    return 0;
}