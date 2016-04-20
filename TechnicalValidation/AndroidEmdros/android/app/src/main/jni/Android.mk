include $(CLEAR_VARS)
LOCAL_MODULE := emdros
LOCAL_SRC_FILES := \
        emdros/emdros_c_amalgamation.c \
        emdros/emdros_amalgamation.cpp \
        emdros/bucket.cpp \
        emdros/harvest.cpp

LOCAL_CPPFLAGS := -DUSE_SYSTEM_SQLITE3=0  -DTHREADSAFE=1  -Iemdros/
LOCAL_CFLAGS := -DTHREADSAFE=1  -Iemdros/
LOCAL_EXPORT_LDLIBS := -lz
LOCAL_CPP_FEATURES += exceptions
include $(BUILD_STATIC_LIBRARY)
