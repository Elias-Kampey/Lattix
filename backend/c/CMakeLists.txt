cmake_minimum_required(VERSION 3.16)

project(Lattix C)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

find_package(OpenSSL REQUIRED)

add_executable(lattix
    src/main.c
    src/crypto_kem.c
    src/crypto_signature.c
    src/crypto_aes.c
    src/api.c
)

target_include_directories(lattix PRIVATE
    include
)

target_link_libraries(lattix
    OpenSSL::Crypto
)