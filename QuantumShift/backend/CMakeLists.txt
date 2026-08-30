cmake_minimum_required(VERSION 3.16)

project(QuantumShift C)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

find_package(OpenSSL REQUIRED)

add_executable(quantumshift
    src/main.c
)

target_link_libraries(quantumshift
    OpenSSL::Crypto
)