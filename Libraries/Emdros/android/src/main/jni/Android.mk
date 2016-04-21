LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)
LOCAL_MODULE := libEmdros
LOCAL_C_INCLUDES := ../../../../src/
LOCAL_SRC_FILES := \
        ../../../../src/emdros_c_amalgamation.c \
        ../../../../src/emdros_amalgamation.cpp \
        ../../../../src/bucket.cpp \
        ../../../../src/harvest.cpp \
				../../../../src/RCTEmdrosEnv.cpp

LOCAL_CPPFLAGS := -DUSE_SYSTEM_SQLITE3=0  -DTHREADSAFE=1
LOCAL_CFLAGS := -DTHREADSAFE=1
LOCAL_EXPORT_LDLIBS := -lz
LOCAL_CPP_FEATURES += exceptions
include $(BUILD_STATIC_LIBRARY)
