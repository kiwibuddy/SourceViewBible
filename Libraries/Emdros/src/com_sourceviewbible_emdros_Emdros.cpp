#include "com_sourceviewbible_emdros_Emdros.h"
#include "emdros.h"
#include "bucket.h"
#include "harvest.h"
#include <fstream>

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

void Java_com_sourceviewbible_emdros_Emdros_connect(JNIEnv *env, jobject obj) {
  eOutputKind output_kind = kOKConsole;
  std::string initial_db("file:///android_asset/sourceview.bpt");
  std::string hostname("localhost");
  std::string user("emdf");
  eBackendKind backend_kind = kBPT;
  std::string password = "";

  EmdrosEnv *emdrosEnv;
  try {
    emdrosEnv = new EmdrosEnv(output_kind, kCSUTF8, hostname, user, password, initial_db, backend_kind);
    if (emdrosEnv->connectionOk() == true) {
      std::cerr << "Connected!!!! :-)";
    } else {
      std::cerr << "Not connected :(";
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

void Java_com_sourceviewbible_emdros_Emdros_dispose(JNIEnv *env, jobject obj) {
  EmdrosEnv *emdrosEnv = getEmdrosEnv(env, obj);
  setEmdrosEnv(env, obj, 0);
  delete emdrosEnv;
}
