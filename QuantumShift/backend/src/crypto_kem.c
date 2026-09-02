#include <stdio.h>
#include <string.h>
#include <time.h>

#include <openssl/evp.h>
#include <openssl/err.h>
#include <openssl/crypto.h>

#include "crypto_kem.h"

static double elapsed_ms(struct timespec start, struct timespec end)
{
    double seconds =
        (double)(end.tv_sec - start.tv_sec) * 1000.0;

    double nanoseconds =
        (double)(end.tv_nsec - start.tv_nsec) / 1000000.0;

    return seconds + nanoseconds;
}

int run_ml_kem_demo(void)
{
    EVP_PKEY_CTX *keygen_ctx = NULL;
    EVP_PKEY_CTX *encap_ctx = NULL;
    EVP_PKEY_CTX *decap_ctx = NULL;

    EVP_PKEY *keypair = NULL;

    unsigned char *ciphertext = NULL;
    unsigned char *bob_secret = NULL;
    unsigned char *alice_secret = NULL;

    size_t ciphertext_len = 0;
    size_t bob_secret_len = 0;
    size_t alice_secret_len = 0;

    struct timespec start;
    struct timespec end;

    double keygen_ms = 0.0;
    double encap_ms = 0.0;
    double decap_ms = 0.0;

    int result = 1;

    printf("QuantumShift - ML-KEM-768 Key Exchange\n");
    printf("--------------------------------------\n\n");

    /*
     * STEP 1:
     * Alice generates an ML-KEM-768 keypair.
     */

    keygen_ctx =
        EVP_PKEY_CTX_new_from_name(
            NULL,
            "ML-KEM-768",
            NULL
        );

    if (keygen_ctx == NULL)
    {
        fprintf(
            stderr,
            "Failed to create ML-KEM key generation context.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    if (EVP_PKEY_keygen_init(keygen_ctx) <= 0)
    {
        fprintf(
            stderr,
            "Failed to initialize ML-KEM key generation.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    printf("Alice: Generating ML-KEM-768 keypair...\n");

    clock_gettime(CLOCK_MONOTONIC, &start);

    if (EVP_PKEY_generate(keygen_ctx, &keypair) <= 0)
    {
        fprintf(
            stderr,
            "ML-KEM key generation failed.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    clock_gettime(CLOCK_MONOTONIC, &end);

    keygen_ms = elapsed_ms(start, end);

    printf("Alice: Keypair generated [OK]\n\n");

    /*
     * STEP 2:
     * Bob encapsulates a shared secret.
     */

    encap_ctx =
        EVP_PKEY_CTX_new_from_pkey(
            NULL,
            keypair,
            NULL
        );

    if (encap_ctx == NULL)
    {
        fprintf(
            stderr,
            "Failed to create encapsulation context.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    if (EVP_PKEY_encapsulate_init(encap_ctx, NULL) <= 0)
    {
        fprintf(
            stderr,
            "Failed to initialize encapsulation.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    /*
     * Ask OpenSSL how large the ciphertext
     * and shared-secret buffers must be.
     */

    if (EVP_PKEY_encapsulate(
            encap_ctx,
            NULL,
            &ciphertext_len,
            NULL,
            &bob_secret_len
        ) <= 0)
    {
        fprintf(
            stderr,
            "Failed to determine encapsulation buffer sizes.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    ciphertext =
        OPENSSL_malloc(ciphertext_len);

    bob_secret =
        OPENSSL_malloc(bob_secret_len);

    if (ciphertext == NULL || bob_secret == NULL)
    {
        fprintf(
            stderr,
            "Memory allocation failed.\n"
        );

        goto cleanup;
    }

    printf("Bob: Encapsulating shared secret...\n");

    clock_gettime(CLOCK_MONOTONIC, &start);

    if (EVP_PKEY_encapsulate(
            encap_ctx,
            ciphertext,
            &ciphertext_len,
            bob_secret,
            &bob_secret_len
        ) <= 0)
    {
        fprintf(
            stderr,
            "ML-KEM encapsulation failed.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    clock_gettime(CLOCK_MONOTONIC, &end);

    encap_ms = elapsed_ms(start, end);

    printf("Bob: Encapsulation complete [OK]\n\n");

    /*
     * STEP 3:
     * Alice decapsulates Bob's ciphertext.
     */

    decap_ctx =
        EVP_PKEY_CTX_new_from_pkey(
            NULL,
            keypair,
            NULL
        );

    if (decap_ctx == NULL)
    {
        fprintf(
            stderr,
            "Failed to create decapsulation context.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    if (EVP_PKEY_decapsulate_init(decap_ctx, NULL) <= 0)
    {
        fprintf(
            stderr,
            "Failed to initialize decapsulation.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    /*
     * Ask OpenSSL how large Alice's
     * shared-secret buffer must be.
     */

    if (EVP_PKEY_decapsulate(
            decap_ctx,
            NULL,
            &alice_secret_len,
            ciphertext,
            ciphertext_len
        ) <= 0)
    {
        fprintf(
            stderr,
            "Failed to determine decapsulation buffer size.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    alice_secret =
        OPENSSL_malloc(alice_secret_len);

    if (alice_secret == NULL)
    {
        fprintf(
            stderr,
            "Memory allocation failed.\n"
        );

        goto cleanup;
    }

    printf("Alice: Decapsulating ciphertext...\n");

    clock_gettime(CLOCK_MONOTONIC, &start);

    if (EVP_PKEY_decapsulate(
            decap_ctx,
            alice_secret,
            &alice_secret_len,
            ciphertext,
            ciphertext_len
        ) <= 0)
    {
        fprintf(
            stderr,
            "ML-KEM decapsulation failed.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    clock_gettime(CLOCK_MONOTONIC, &end);

    decap_ms = elapsed_ms(start, end);

    printf("Alice: Decapsulation complete [OK]\n\n");

    /*
     * STEP 4:
     * Compare Bob's secret with Alice's secret.
     */

    printf("Comparing shared secrets...\n");

    if (
        bob_secret_len == alice_secret_len &&
        memcmp(
            bob_secret,
            alice_secret,
            bob_secret_len
        ) == 0
    )
    {
        printf("Shared Secret Match [OK]\n");
    }
    else
    {
        printf("Shared Secret Match [FAILED]\n");
        goto cleanup;
    }

    printf("\n");
    printf("Results\n");
    printf("--------------------------------------\n");

    printf(
        "Algorithm:          ML-KEM-768\n"
    );

    printf(
        "Ciphertext size:    %zu bytes\n",
        ciphertext_len
    );

    printf(
        "Shared secret size: %zu bytes\n",
        bob_secret_len
    );

    printf(
        "Key generation:     %.3f ms\n",
        keygen_ms
    );

    printf(
        "Encapsulation:      %.3f ms\n",
        encap_ms
    );

    printf(
        "Decapsulation:      %.3f ms\n",
        decap_ms
    );

    result = 0;

cleanup:

    if (bob_secret != NULL)
    {
        OPENSSL_cleanse(
            bob_secret,
            bob_secret_len
        );

        OPENSSL_free(bob_secret);
    }

    if (alice_secret != NULL)
    {
        OPENSSL_cleanse(
            alice_secret,
            alice_secret_len
        );

        OPENSSL_free(alice_secret);
    }

    if (ciphertext != NULL)
    {
        OPENSSL_free(ciphertext);
    }

    EVP_PKEY_CTX_free(decap_ctx);
    EVP_PKEY_CTX_free(encap_ctx);
    EVP_PKEY_CTX_free(keygen_ctx);

    EVP_PKEY_free(keypair);

    return result;
}