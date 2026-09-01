#include <stdio.h>
#include <string.h>
#include <time.h>

#include <openssl/evp.h>
#include <openssl/err.h>
#include <openssl/crypto.h>

#include "crypto_signature.h"

static double elapsed_ms(struct timespec start, struct timespec end)
{
    double seconds =
        (double)(end.tv_sec - start.tv_sec) * 1000.0;

    double nanoseconds =
        (double)(end.tv_nsec - start.tv_nsec) / 1000000.0;

    return seconds + nanoseconds;
}

int run_ml_dsa_demo(void)
{
    EVP_PKEY_CTX *keygen_ctx = NULL;
    EVP_PKEY *keypair = NULL;

    EVP_MD_CTX *sign_ctx = NULL;
    EVP_MD_CTX *verify_ctx = NULL;

    unsigned char *signature = NULL;
    size_t signature_len = 0;

    const unsigned char message[] =
        "Hello QuantumShift";

    const unsigned char tampered_message[] =
        "Hello QuantumShifx";

    struct timespec start;
    struct timespec end;

    double keygen_ms = 0.0;
    double sign_ms = 0.0;
    double verify_ms = 0.0;

    int verify_result = 0;
    int tamper_result = 0;
    int result = 1;

    printf("QuantumShift - ML-DSA-65 Signature Test\n");
    printf("--------------------------------------\n\n");

    /*
     * STEP 1:
     * Generate ML-DSA-65 keypair.
     */

    keygen_ctx =
        EVP_PKEY_CTX_new_from_name(
            NULL,
            "ML-DSA-65",
            NULL
        );

    if (keygen_ctx == NULL)
    {
        fprintf(
            stderr,
            "Failed to create ML-DSA-65 key generation context.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    if (EVP_PKEY_keygen_init(keygen_ctx) <= 0)
    {
        fprintf(
            stderr,
            "Failed to initialize ML-DSA key generation.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    printf("Generating ML-DSA-65 keypair...\n");

    clock_gettime(CLOCK_MONOTONIC, &start);

    if (EVP_PKEY_generate(keygen_ctx, &keypair) <= 0)
    {
        fprintf(
            stderr,
            "ML-DSA-65 key generation failed.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    clock_gettime(CLOCK_MONOTONIC, &end);

    keygen_ms = elapsed_ms(start, end);

    printf("Keypair generated [OK]\n\n");

    /*
     * STEP 2:
     * Sign the original message.
     */

    sign_ctx = EVP_MD_CTX_new();

    if (sign_ctx == NULL)
    {
        fprintf(
            stderr,
            "Failed to create signing context.\n"
        );

        goto cleanup;
    }

    if (EVP_DigestSignInit(
            sign_ctx,
            NULL,
            NULL,
            NULL,
            keypair
        ) <= 0)
    {
        fprintf(
            stderr,
            "Failed to initialize ML-DSA signing.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    /*
     * Ask OpenSSL how large the signature buffer must be.
     */

    if (EVP_DigestSign(
            sign_ctx,
            NULL,
            &signature_len,
            message,
            strlen((const char *)message)
        ) <= 0)
    {
        fprintf(
            stderr,
            "Failed to determine signature size.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    signature = OPENSSL_malloc(signature_len);

    if (signature == NULL)
    {
        fprintf(
            stderr,
            "Failed to allocate signature buffer.\n"
        );

        goto cleanup;
    }

    printf("Signing message...\n");

    clock_gettime(CLOCK_MONOTONIC, &start);

    if (EVP_DigestSign(
            sign_ctx,
            signature,
            &signature_len,
            message,
            strlen((const char *)message)
        ) <= 0)
    {
        fprintf(
            stderr,
            "ML-DSA signing failed.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    clock_gettime(CLOCK_MONOTONIC, &end);

    sign_ms = elapsed_ms(start, end);

    printf("Signature generated [OK]\n\n");

    /*
     * STEP 3:
     * Verify the original message.
     */

    verify_ctx = EVP_MD_CTX_new();

    if (verify_ctx == NULL)
    {
        fprintf(
            stderr,
            "Failed to create verification context.\n"
        );

        goto cleanup;
    }

    if (EVP_DigestVerifyInit(
            verify_ctx,
            NULL,
            NULL,
            NULL,
            keypair
        ) <= 0)
    {
        fprintf(
            stderr,
            "Failed to initialize ML-DSA verification.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    printf("Verifying original message...\n");

    clock_gettime(CLOCK_MONOTONIC, &start);

    verify_result =
        EVP_DigestVerify(
            verify_ctx,
            signature,
            signature_len,
            message,
            strlen((const char *)message)
        );

    clock_gettime(CLOCK_MONOTONIC, &end);

    verify_ms = elapsed_ms(start, end);

    if (verify_result == 1)
    {
        printf("Original message: VALID [OK]\n\n");
    }
    else
    {
        printf("Original message: INVALID [FAILED]\n");

        if (verify_result < 0)
        {
            ERR_print_errors_fp(stderr);
        }

        goto cleanup;
    }

    /*
     * STEP 4:
     * Tamper with the message and verify again.
     */

    EVP_MD_CTX_free(verify_ctx);
    verify_ctx = EVP_MD_CTX_new();

    if (verify_ctx == NULL)
    {
        fprintf(
            stderr,
            "Failed to create tamper-test verification context.\n"
        );

        goto cleanup;
    }

    if (EVP_DigestVerifyInit(
            verify_ctx,
            NULL,
            NULL,
            NULL,
            keypair
        ) <= 0)
    {
        fprintf(
            stderr,
            "Failed to initialize tamper verification.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    printf("Testing modified message...\n");

    tamper_result =
        EVP_DigestVerify(
            verify_ctx,
            signature,
            signature_len,
            tampered_message,
            strlen((const char *)tampered_message)
        );

    if (tamper_result == 0)
    {
        printf("Modified message: INVALID [OK]\n");
    }
    else if (tamper_result == 1)
    {
        printf("Modified message: VALID [FAILED]\n");
        goto cleanup;
    }
    else
    {
        fprintf(
            stderr,
            "Tamper verification returned an error.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    printf("\nResults\n");
    printf("--------------------------------------\n");

    printf("Algorithm:       ML-DSA-65\n");
    printf("Message:         %s\n", message);
    printf("Signature size:  %zu bytes\n", signature_len);
    printf("Key generation:  %.3f ms\n", keygen_ms);
    printf("Signing:         %.3f ms\n", sign_ms);
    printf("Verification:    %.3f ms\n", verify_ms);

    result = 0;

cleanup:

    if (signature != NULL)
    {
        OPENSSL_free(signature);
    }

    EVP_MD_CTX_free(verify_ctx);
    EVP_MD_CTX_free(sign_ctx);

    EVP_PKEY_free(keypair);
    EVP_PKEY_CTX_free(keygen_ctx);

    return result;
}