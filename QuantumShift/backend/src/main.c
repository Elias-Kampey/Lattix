#include <stdio.h>
#include <openssl/evp.h>
#include <openssl/err.h>

int main(void)
{
    EVP_PKEY_CTX *ctx = NULL;
    EVP_PKEY *keypair = NULL;

    printf("QuantumShift - ML-KEM-768 Test\n");
    printf("------------------------------\n");

    /* Create an OpenSSL context for ML-KEM-768 */
    ctx = EVP_PKEY_CTX_new_from_name(NULL, "ML-KEM-768", NULL);

    if (ctx == NULL)
    {
        fprintf(stderr, "Failed to create ML-KEM-768 context.\n");
        ERR_print_errors_fp(stderr);
        return 1;
    }

    /* Initialize key generation */
    if (EVP_PKEY_keygen_init(ctx) <= 0)
    {
        fprintf(stderr, "Failed to initialize ML-KEM key generation.\n");
        ERR_print_errors_fp(stderr);

        EVP_PKEY_CTX_free(ctx);
        return 1;
    }

    printf("Generating ML-KEM-768 keypair...\n");

    /* Generate the keypair */
    if (EVP_PKEY_generate(ctx, &keypair) <= 0)
    {
        fprintf(stderr, "ML-KEM-768 key generation failed.\n");
        ERR_print_errors_fp(stderr);

        EVP_PKEY_CTX_free(ctx);
        return 1;
    }

    printf("ML-KEM-768 keypair generated successfully! [OK]\n");

    EVP_PKEY_free(keypair);
    EVP_PKEY_CTX_free(ctx);

    return 0;
}