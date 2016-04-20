LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)
LOCAL_MODULE := libEmdros
LOCAL_C_INCLUDES := ../../../../../../../Libraries/Emdros/src/
LOCAL_SRC_FILES := \
        ../../../../../../../Libraries/Emdros/src/emdros_c_amalgamation.c \
        ../../../../../../../Libraries/Emdros/src/emdros_amalgamation.cpp \
        ../../../../../../../Libraries/Emdros/src/bucket.cpp \
        ../../../../../../../Libraries/Emdros/src/harvest.cpp

LOCAL_CPPFLAGS := -DUSE_SYSTEM_SQLITE3=0  -DTHREADSAFE=1
LOCAL_CFLAGS := -DTHREADSAFE=1
LOCAL_EXPORT_LDLIBS := -lz
LOCAL_CPP_FEATURES += exceptions
include $(BUILD_STATIC_LIBRARY)
