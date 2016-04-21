LOCAL_PATH := $(call my-dir)

# SQLITE3
include $(CLEAR_VARS)
LOCAL_MODULE    := libsqlite3
LOCAL_C_INCLUDES := sqlite3/
LOCAL_SRC_FILES := \
				sqlite3/sqlite3.c \
				sqlite3/encryption.c
include $(BUILD_SHARED_LIBRARY)

# Emdros
include $(CLEAR_VARS)
LOCAL_MODULE := libEmdros
LOCAL_C_INCLUDES := ../../../../src/
LOCAL_SRC_FILES := \
        ../../../../src/emdros_c_amalgamation.c \
        ../../../../src/emdros_amalgamation.cpp \
        ../../../../src/bucket.cpp \
        ../../../../src/harvest.cpp \
				../../../../src/com_sourceviewbible_emdros_Emdros.cpp
LOCAL_CPPFLAGS := -DUSE_SYSTEM_SQLITE3=0 -DTHREADSAFE=1
LOCAL_CFLAGS := -DTHREADSAFE=1
LOCAL_LDLIBS := -lz
LOCAL_CPP_FEATURES += exceptions
LOCAL_SHARED_LIBRARIES := sqlite3
include $(BUILD_SHARED_LIBRARY)

#
#
# # React Native
# include $(CLEAR_VARS)
# LOCAL_MODULE := libEmdrosEnv
# LOCAL_C_INCLUDES := ../../../../src/
# LOCAL_SRC_FILES := ../../../../src/com_sourceviewbible_emdros_EmdrosEnv.cpp
# LOCAL_CPPFLAGS := -DTHREADSAFE=1
# LOCAL_CFLAGS := -DTHREADSAFE=1
# LOCAL_CPP_FEATURES += exceptions
# LOCAL_SHARED_LIBRARIES := sqlite3
# LOCAL_STATIC_LIBRARIES := Emdros
# include $(BUILD_SHARED_LIBRARY)
