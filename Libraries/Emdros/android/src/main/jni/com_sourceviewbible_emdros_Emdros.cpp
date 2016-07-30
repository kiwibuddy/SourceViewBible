#include "com_sourceviewbible_emdros_Emdros.h"
#include "emdros.h"
#include "bucket.h"
#include "harvest.h"
#include <fstream>

#include <android/log.h>
#define LOG_TAG "Emdros"
#define LOGV(...) __android_log_print(ANDROID_LOG_VERBOSE, LOG_TAG, __VA_ARGS__)

const char RCTKeyCString[] = {48, 120, 51, 48, 97, 49, 50, 56, 50, 57, 32, 48, 120, 48, 50, 50, 56, 102, 53, 50, 55, 32, 48, 120, 49, 56, 55, 49, 56, 49, 51, 100, 32, 48, 120, 54, 53, 50, 53, 54, 55, 101, 57, 32, 48, 120, 53, 99, 101, 97, 50, 56, 98, 53, 32, 48, 120, 51, 100, 55, 100, 52, 98, 99, 55, 32, 48, 120, 53, 48, 48, 102, 101, 99, 100, 49, 32, 48, 120, 54, 99, 57, 51, 53, 54, 56, 100, 0};

jfieldID getEmdrosEnvField(JNIEnv *env, jobject obj)
{
    jclass c = env->GetObjectClass(obj);
    // J is the type signature for long:
    return env->GetFieldID(c, "emdrosEnv", "J");
}

template <typename T>
T *getEmdrosEnv(JNIEnv *env, jobject obj)
{
    jlong emdrosEnv = env->GetLongField(obj, getEmdrosEnvField(env, obj));
    return reinterpret_cast<T *>(emdrosEnv);
}

template <typename T>
void setEmdrosEnv(JNIEnv *env, jobject obj, T *t)
{
    jlong emdrosEnv = reinterpret_cast<jlong>(t);
    env->SetLongField(obj, getEmdrosEnvField(env, obj), emdrosEnv);
}

void GetJStringContent(JNIEnv *env, jstring AStr, std::string &ARes) {
  if (!AStr) {
    ARes.clear();
    return;
  }

  const char *s = env->GetStringUTFChars(AStr,NULL);
  ARes=s;
  env->ReleaseStringUTFChars(AStr,s);
}

void Java_com_sourceviewbible_emdros_Emdros_connect(JNIEnv *env, jobject obj, jstring jdatabasePath) {
  std::string databasePath;
  GetJStringContent(env, jdatabasePath, databasePath);

  eOutputKind output_kind = kOKConsole;
  std::string initial_db(databasePath);
  std::string hostname("localhost");
  std::string user("emdf");
  eBackendKind backend_kind = kBPT;
  std::string password(RCTKeyCString);

  EmdrosEnv *emdrosEnv;
  try {
    emdrosEnv = new EmdrosEnv(output_kind, kCSUTF8, hostname, user, password, initial_db, backend_kind);
    if (emdrosEnv->connectionOk() == true) {
      LOGV("Connected!!!!");
    } else {
      LOGV("Not connected: %s", emdrosEnv->getDBError().c_str());
    }
    setEmdrosEnv(env, obj, emdrosEnv);
  } catch (EMdFDBException e) {
      std::cerr << "ERROR: EMdFDBException (Database error)..." << std::endl;
      std::cerr << emdrosEnv->getDBError() << std::endl;
      std::cerr << emdrosEnv->getCompilerError() << std::endl;
  } catch (BadMonadsException e) {
      std::cerr << "BadMonadsException caught.  Program aborted." << std::endl;
  } catch (WrongCharacterSetException e) {
      std::cerr << "WrongCharacterSetException caught.  Program aborted." << std::endl;
  } catch (EMdFOutputException e) {
      std::cerr << "EMdFOutputException caught.  Program aborted." << std::endl;
  } catch (EmdrosException e) {
      std::cerr << "ERROR: EmdrosException (Emdros error)..." << e.what() << std::endl;
  } catch (...) {
      std::cerr << "Unknown exception occurred.  Program aborted." << std::endl;
  }
}

jstring Java_com_sourceviewbible_emdros_Emdros_string(JNIEnv *env, jobject obj, jlong from, jlong to, jstring jstylesheet) {
  EmdrosEnv *emdrosEnv = getEmdrosEnv<EmdrosEnv>(env, obj);

  std::string stylesheet;
  GetJStringContent(env, jstylesheet, stylesheet);

  std::string dbName("");
  std::string stylesheetName("base");
  bool bResult;
  std::string rendered_objects = render_objects(emdrosEnv, dbName, stylesheet, stylesheetName, (long)from, (long)to, bResult);
  return env->NewStringUTF(rendered_objects.c_str());
}

void Java_com_sourceviewbible_emdros_Emdros_dispose(JNIEnv *env, jobject obj) {
  // EmdrosEnv *emdrosEnv = getEmdrosEnv<EmdrosEnv>(env, obj);
  // setEmdrosEnv(env, obj, 0);
  // delete emdrosEnv;
}
