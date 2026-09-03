cmake_minimum_required(VERSION 3.16)

project(QuantumShift C)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

find_package(OpenSSL REQUIRED)

add_executable(quantumshift
    src/main.c
    src/crypto_kem.c
    src/crypto_signature.c
    src/crypto_aes.c
    src/api.c
)

target_include_directories(quantumshift PRIVATE
    include
)

target_link_libraries(quantumshift
    OpenSSL::Crypto
)

if(CMAKE_C_COMPILER_ID MATCHES "Clang|GNU")
    target_compile_options(quantumshift PRIVATE
        -Wall
        -Wextra
        -Wpedantic
        -Wconversion
        -Wshadow
        -Wformat=2
        -Wundef
        -fsanitize=address,undefined
        -fno-omit-frame-pointer
    )

    target_link_options(quantumshift PRIVATE
        -fsanitize=address,undefined
    )
endif()