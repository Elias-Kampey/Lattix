#include <stdio.h>
#include <string.h>

#include "crypto_kem.h"
#include "crypto_signature.h"
#include "crypto_aes.h"
#include "api.h"

int main(int argc, char *argv[])
{
    if (argc == 2)
    {
        if (strcmp(argv[1], "ml-kem") == 0)
        {
            return print_ml_kem_json();
        }

        if (strcmp(argv[1], "ml-dsa") == 0)
        {
            return print_ml_dsa_json();
        }

        if (strcmp(argv[1], "aes") == 0)
        {
            return print_aes_gcm_json();
        }

        fprintf(
            stderr,
            "Unknown operation: %s\n",
            argv[1]
        );

        fprintf(
            stderr,
            "Usage: %s [ml-kem | ml-dsa | aes]\n",
            argv[0]
        );

        return 1;
    }

    printf("\n======================================\n");
    printf("Lattix Backend\n");
    printf("======================================\n\n");

    if (run_ml_kem_demo() != 0)
    {
        printf("\nML-KEM test failed.\n");
        return 1;
    }

    printf("\n======================================\n\n");

    if (run_ml_dsa_demo() != 0)
    {
        printf("\nML-DSA test failed.\n");
        return 1;
    }

    printf("\n======================================\n\n");

    if (run_aes_gcm_demo() != 0)
    {
        printf("\nAES-GCM test failed.\n");
        return 1;
    }

    printf("\n======================================\n");
    printf("All backend tests passed [OK]\n");
    printf("======================================\n");

    return 0;
}