#include <stdio.h>
#include <unistd.h>

#include "api.h"
#include "crypto_kem.h"
#include "crypto_signature.h"
#include "crypto_aes.h"

/*
 * Temporarily hide stdout while the crypto functions run.
 * Their normal terminal logs are suppressed in API mode.
 */

static int suppress_stdout(void)
{
    fflush(stdout);

    int saved_stdout = dup(STDOUT_FILENO);

    if (saved_stdout == -1)
    {
        return -1;
    }

    FILE *null_file = fopen("/dev/null", "w");

    if (null_file == NULL)
    {
        close(saved_stdout);
        return -1;
    }

    if (dup2(fileno(null_file), STDOUT_FILENO) == -1)
    {
        fclose(null_file);
        close(saved_stdout);
        return -1;
    }

    fclose(null_file);

    return saved_stdout;
}

static void restore_stdout(int saved_stdout)
{
    if (saved_stdout == -1)
    {
        return;
    }

    fflush(stdout);

    dup2(saved_stdout, STDOUT_FILENO);
    close(saved_stdout);
}

/*
 * ML-KEM JSON
 */

int print_ml_kem_json(void)
{
    MLKEMResult result;

    int saved_stdout = suppress_stdout();

    if (saved_stdout == -1)
    {
        fprintf(stderr, "Failed to suppress stdout.\n");
        return 1;
    }

    int status = run_ml_kem(&result);

    restore_stdout(saved_stdout);

    if (status != 0)
    {
        printf(
            "{\"success\":false,"
            "\"operation\":\"ml-kem\"}\n"
        );

        return 1;
    }

    printf(
        "{"
        "\"success\":true,"
        "\"algorithm\":\"ML-KEM-768\","
        "\"ciphertext_size\":%zu,"
        "\"shared_secret_size\":%zu,"
        "\"keygen_ms\":%.6f,"
        "\"encapsulation_ms\":%.6f,"
        "\"decapsulation_ms\":%.6f"
        "}\n",
        result.ciphertext_size,
        result.shared_secret_size,
        result.keygen_ms,
        result.encapsulation_ms,
        result.decapsulation_ms
    );

    return 0;
}

/*
 * ML-DSA JSON
 */

int print_ml_dsa_json(void)
{
    MLDSAResult result;

    int saved_stdout = suppress_stdout();

    if (saved_stdout == -1)
    {
        fprintf(stderr, "Failed to suppress stdout.\n");
        return 1;
    }

    int status = run_ml_dsa(&result);

    restore_stdout(saved_stdout);

    if (status != 0)
    {
        printf(
            "{\"success\":false,"
            "\"operation\":\"ml-dsa\"}\n"
        );

        return 1;
    }

    printf(
        "{"
        "\"success\":true,"
        "\"algorithm\":\"ML-DSA-65\","
        "\"signature_size\":%zu,"
        "\"original_valid\":%s,"
        "\"tampered_valid\":%s,"
        "\"keygen_ms\":%.6f,"
        "\"sign_ms\":%.6f,"
        "\"verify_ms\":%.6f"
        "}\n",
        result.signature_size,
        result.original_valid ? "true" : "false",
        result.tampered_valid ? "true" : "false",
        result.keygen_ms,
        result.sign_ms,
        result.verify_ms
    );

    return 0;
}

/*
 * AES-256-GCM JSON
 */

int print_aes_gcm_json(void)
{
    AESGCMResult result;

    int saved_stdout = suppress_stdout();

    if (saved_stdout == -1)
    {
        fprintf(stderr, "Failed to suppress stdout.\n");
        return 1;
    }

    int status = run_aes_gcm(&result);

    restore_stdout(saved_stdout);

    if (status != 0)
    {
        printf(
            "{\"success\":false,"
            "\"operation\":\"aes-gcm\"}\n"
        );

        return 1;
    }

    printf(
        "{"
        "\"success\":true,"
        "\"algorithm\":\"AES-256-GCM\","
        "\"plaintext_size\":%d,"
        "\"ciphertext_size\":%d,"
        "\"tag_size\":%d,"
        "\"plaintext_match\":%s,"
        "\"tamper_rejected\":%s,"
        "\"encrypt_ms\":%.6f,"
        "\"decrypt_ms\":%.6f"
        "}\n",
        result.plaintext_size,
        result.ciphertext_size,
        result.tag_size,
        result.plaintext_match ? "true" : "false",
        result.tamper_rejected ? "true" : "false",
        result.encrypt_ms,
        result.decrypt_ms
    );

    return 0;
}