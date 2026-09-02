#include <stdio.h>
#include <string.h>
#include <time.h>

#include <openssl/evp.h>
#include <openssl/rand.h>
#include <openssl/crypto.h>
#include <openssl/err.h>

#include "crypto_aes.h"

#define AES_KEY_SIZE 32
#define AES_IV_SIZE 12
#define AES_TAG_SIZE 16

static double elapsed_ms(struct timespec start, struct timespec end)
{
    double seconds =
        (double)(end.tv_sec - start.tv_sec) * 1000.0;

    double nanoseconds =
        (double)(end.tv_nsec - start.tv_nsec) / 1000000.0;

    return seconds + nanoseconds;
}

int run_aes_gcm(AESGCMResult *out)
{
    const unsigned char plaintext[] =
        "QuantumShift AES-256-GCM test message";

    unsigned char key[AES_KEY_SIZE];
    unsigned char iv[AES_IV_SIZE];
    unsigned char tag[AES_TAG_SIZE];

    unsigned char ciphertext[256];
    unsigned char decrypted[256];
    unsigned char tampered_ciphertext[256];

    int plaintext_len =
        (int)strlen((const char *)plaintext);

    int ciphertext_len = 0;
    int decrypted_len = 0;

    int len = 0;

    EVP_CIPHER_CTX *encrypt_ctx = NULL;
    EVP_CIPHER_CTX *decrypt_ctx = NULL;

    struct timespec start;
    struct timespec end;

    double encrypt_ms = 0.0;
    double decrypt_ms = 0.0;

    int result = 1;

    if (out == NULL)
    {
        return 1;
    }

    out->success = 0;
    out->plaintext_match = 0;
    out->tamper_rejected = 0;
    out->plaintext_size = 0;
    out->ciphertext_size = 0;
    out->tag_size = 0;
    out->encrypt_ms = 0.0;
    out->decrypt_ms = 0.0;

    printf("QuantumShift - AES-256-GCM Test\n");
    printf("--------------------------------------\n\n");

    /*
     * STEP 1:
     * Generate random AES-256 key and IV.
     */

    if (RAND_bytes(key, sizeof(key)) != 1)
    {
        fprintf(
            stderr,
            "Failed to generate AES key.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    if (RAND_bytes(iv, sizeof(iv)) != 1)
    {
        fprintf(
            stderr,
            "Failed to generate AES IV.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    printf("AES-256 key generated [OK]\n");
    printf("Random IV generated [OK]\n\n");

    /*
     * STEP 2:
     * Encrypt plaintext.
     */

    encrypt_ctx = EVP_CIPHER_CTX_new();

    if (encrypt_ctx == NULL)
    {
        fprintf(
            stderr,
            "Failed to create encryption context.\n"
        );

        goto cleanup;
    }

    if (EVP_EncryptInit_ex(
            encrypt_ctx,
            EVP_aes_256_gcm(),
            NULL,
            NULL,
            NULL
        ) != 1)
    {
        fprintf(
            stderr,
            "Failed to initialize AES-GCM encryption.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    if (EVP_CIPHER_CTX_ctrl(
            encrypt_ctx,
            EVP_CTRL_GCM_SET_IVLEN,
            AES_IV_SIZE,
            NULL
        ) != 1)
    {
        fprintf(
            stderr,
            "Failed to set AES-GCM IV length.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    if (EVP_EncryptInit_ex(
            encrypt_ctx,
            NULL,
            NULL,
            key,
            iv
        ) != 1)
    {
        fprintf(
            stderr,
            "Failed to set AES key and IV.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    printf("Encrypting plaintext...\n");

    clock_gettime(CLOCK_MONOTONIC, &start);

    if (EVP_EncryptUpdate(
            encrypt_ctx,
            ciphertext,
            &len,
            plaintext,
            plaintext_len
        ) != 1)
    {
        fprintf(
            stderr,
            "AES encryption failed.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    ciphertext_len = len;

    if (EVP_EncryptFinal_ex(
            encrypt_ctx,
            ciphertext + ciphertext_len,
            &len
        ) != 1)
    {
        fprintf(
            stderr,
            "AES encryption finalization failed.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    ciphertext_len += len;

    if (EVP_CIPHER_CTX_ctrl(
            encrypt_ctx,
            EVP_CTRL_GCM_GET_TAG,
            AES_TAG_SIZE,
            tag
        ) != 1)
    {
        fprintf(
            stderr,
            "Failed to retrieve GCM tag.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    clock_gettime(CLOCK_MONOTONIC, &end);

    encrypt_ms = elapsed_ms(start, end);

    printf("Encryption complete [OK]\n\n");

    /*
     * STEP 3:
     * Decrypt valid ciphertext.
     */

    decrypt_ctx = EVP_CIPHER_CTX_new();

    if (decrypt_ctx == NULL)
    {
        fprintf(
            stderr,
            "Failed to create decryption context.\n"
        );

        goto cleanup;
    }

    if (EVP_DecryptInit_ex(
            decrypt_ctx,
            EVP_aes_256_gcm(),
            NULL,
            NULL,
            NULL
        ) != 1)
    {
        fprintf(
            stderr,
            "Failed to initialize AES-GCM decryption.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    if (EVP_CIPHER_CTX_ctrl(
            decrypt_ctx,
            EVP_CTRL_GCM_SET_IVLEN,
            AES_IV_SIZE,
            NULL
        ) != 1)
    {
        fprintf(
            stderr,
            "Failed to set decryption IV length.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    if (EVP_DecryptInit_ex(
            decrypt_ctx,
            NULL,
            NULL,
            key,
            iv
        ) != 1)
    {
        fprintf(
            stderr,
            "Failed to set decryption key and IV.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    printf("Decrypting ciphertext...\n");

    clock_gettime(CLOCK_MONOTONIC, &start);

    if (EVP_DecryptUpdate(
            decrypt_ctx,
            decrypted,
            &len,
            ciphertext,
            ciphertext_len
        ) != 1)
    {
        fprintf(
            stderr,
            "AES decryption failed.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    decrypted_len = len;

    if (EVP_CIPHER_CTX_ctrl(
            decrypt_ctx,
            EVP_CTRL_GCM_SET_TAG,
            AES_TAG_SIZE,
            tag
        ) != 1)
    {
        fprintf(
            stderr,
            "Failed to set GCM authentication tag.\n"
        );

        ERR_print_errors_fp(stderr);
        goto cleanup;
    }

    if (EVP_DecryptFinal_ex(
            decrypt_ctx,
            decrypted + decrypted_len,
            &len
        ) != 1)
    {
        fprintf(
            stderr,
            "Authentication failed on valid ciphertext.\n"
        );

        goto cleanup;
    }

    decrypted_len += len;

    clock_gettime(CLOCK_MONOTONIC, &end);

    decrypt_ms = elapsed_ms(start, end);

    decrypted[decrypted_len] = '\0';

    printf("Decryption complete [OK]\n");

    if (strcmp(
            (const char *)plaintext,
            (const char *)decrypted
        ) == 0)
    {
        printf("Plaintext match [OK]\n\n");
    }
    else
    {
        printf("Plaintext match [FAILED]\n");
        goto cleanup;
    }

    /*
     * STEP 4:
     * Tamper with ciphertext and verify
     * that GCM rejects it.
     */

    memcpy(
        tampered_ciphertext,
        ciphertext,
        ciphertext_len
    );

    tampered_ciphertext[0] ^= 0x01;

    EVP_CIPHER_CTX_free(decrypt_ctx);
    decrypt_ctx = EVP_CIPHER_CTX_new();

    if (decrypt_ctx == NULL)
    {
        fprintf(
            stderr,
            "Failed to create tamper-test context.\n"
        );

        goto cleanup;
    }

    if (EVP_DecryptInit_ex(
            decrypt_ctx,
            EVP_aes_256_gcm(),
            NULL,
            NULL,
            NULL
        ) != 1)
    {
        goto cleanup;
    }

    if (EVP_CIPHER_CTX_ctrl(
            decrypt_ctx,
            EVP_CTRL_GCM_SET_IVLEN,
            AES_IV_SIZE,
            NULL
        ) != 1)
    {
        goto cleanup;
    }

    if (EVP_DecryptInit_ex(
            decrypt_ctx,
            NULL,
            NULL,
            key,
            iv
        ) != 1)
    {
        goto cleanup;
    }

    if (EVP_DecryptUpdate(
            decrypt_ctx,
            decrypted,
            &len,
            tampered_ciphertext,
            ciphertext_len
        ) != 1)
    {
        goto cleanup;
    }

    if (EVP_CIPHER_CTX_ctrl(
            decrypt_ctx,
            EVP_CTRL_GCM_SET_TAG,
            AES_TAG_SIZE,
            tag
        ) != 1)
    {
        goto cleanup;
    }

    printf("Testing tampered ciphertext...\n");

    if (EVP_DecryptFinal_ex(
            decrypt_ctx,
            decrypted + len,
            &decrypted_len
        ) <= 0)
    {
        printf("Tampered ciphertext rejected [OK]\n");
    }
    else
    {
        printf("Tampered ciphertext accepted [FAILED]\n");
        goto cleanup;
    }

    printf("\nResults\n");
    printf("--------------------------------------\n");

    printf("Algorithm:       AES-256-GCM\n");
    printf("Plaintext size:  %d bytes\n", plaintext_len);
    printf("Ciphertext size: %d bytes\n", ciphertext_len);
    printf("Tag size:        %d bytes\n", AES_TAG_SIZE);
    printf("Encryption:      %.3f ms\n", encrypt_ms);
    printf("Decryption:      %.3f ms\n", decrypt_ms);

    /*
     * Save result data for API/frontend use.
     */

    out->success = 1;
    out->plaintext_match = 1;
    out->tamper_rejected = 1;

    out->plaintext_size = plaintext_len;
    out->ciphertext_size = ciphertext_len;
    out->tag_size = AES_TAG_SIZE;

    out->encrypt_ms = encrypt_ms;
    out->decrypt_ms = decrypt_ms;

    result = 0;

cleanup:

    OPENSSL_cleanse(
        key,
        sizeof(key)
    );

    EVP_CIPHER_CTX_free(encrypt_ctx);
    EVP_CIPHER_CTX_free(decrypt_ctx);

    return result;
}

int run_aes_gcm_demo(void)
{
    AESGCMResult result;

    return run_aes_gcm(&result);
}