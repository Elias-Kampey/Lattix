#ifndef PLATFORM_COMPAT_H
#define PLATFORM_COMPAT_H

#include <time.h>

#ifdef _WIN32

#include <windows.h>
#include <io.h>

#ifndef CLOCK_MONOTONIC
#define CLOCK_MONOTONIC 1
#endif

static inline int ciphershift_clock_gettime(
    int clock_id,
    struct timespec *ts
)
{
    LARGE_INTEGER frequency;
    LARGE_INTEGER counter;

    (void)clock_id;

    if (!QueryPerformanceFrequency(&frequency))
    {
        return -1;
    }

    if (!QueryPerformanceCounter(&counter))
    {
        return -1;
    }

    ts->tv_sec =
        (time_t)(counter.QuadPart / frequency.QuadPart);

    ts->tv_nsec =
        (long)(
            ((counter.QuadPart % frequency.QuadPart)
             * 1000000000LL)
            / frequency.QuadPart
        );

    return 0;
}

#define clock_gettime ciphershift_clock_gettime

#define dup _dup
#define dup2 _dup2
#define close _close
#define fileno _fileno

#ifndef STDOUT_FILENO
#define STDOUT_FILENO 1
#endif

#define NULL_DEVICE "NUL"

#else

#include <unistd.h>

#define NULL_DEVICE "/dev/null"

#endif

#endif