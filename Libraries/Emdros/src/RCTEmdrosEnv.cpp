#include "com_sourceviewbible_emdros_Emdros.h"
#include "emdros.h"
#include "bucket.h"
#include "harvest.h"
#include <fstream>
#include "RCTEmdrosEnv.h"

void Java_com_sourceviewbible_emdros_Emdros_connect(JNIEnv *env, jobject obj) {
  eOutputKind output_kind = kOKConsole;
  std::string initial_db("sourceview.bpt");
  std::string hostname("localhost");
  std::string user("emdf");
  eBackendKind backend_kind = kBPT;
  std::string password = "";

  EmdrosEnv *emdrosEnv;
  try {
    EmdrosEnv *emdrosEnv = new EmdrosEnv(output_kind, kCSUTF8, hostname, user, password, initial_db, backend_kind);
    if (emdrosEnv->connectionOk() == true) {
      std::cerr << "Connected!!!! :-)";
    } else {
      std::cerr << "Not connected :(";
    }
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

  setEmdrosEnv(env, obj, emdrosEnv);
}
