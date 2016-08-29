#include "com_sourceviewbible_emdros_Emdros.h"
#include "emdros.h"
#include "bucket.h"
#include "harvest.h"
#include <fstream>

#include <android/log.h>
#define LOG_TAG "Emdros"
#define LOGV(...) __android_log_print(ANDROID_LOG_VERBOSE, LOG_TAG, __VA_ARGS__)

const char RCTKeyCString[] = {48, 120, 54, 55, 100, 51, 100, 54, 55, 100, 32, 48, 120, 50, 50, 55, 57, 56, 53, 48, 57, 32, 48, 120, 49, 51, 101, 54, 98, 49, 99, 57, 32, 48, 120, 51, 52, 99, 50, 50, 51, 57, 55, 32, 48, 120, 54, 49, 101, 49, 98, 53, 98, 49, 32, 48, 120, 51, 56, 99, 52, 100, 49, 98, 49, 32, 48, 120, 50, 53, 101, 51, 102, 54, 100, 57, 32, 48, 120, 49, 97, 50, 102, 50, 57, 100, 55, 0};

const std::string RCTStopwordsArray[] = {"the","and","of","to","you","will","in","I","a","he","for","they","your","is","with","his","from","that","be","all","them","as","who","it","was","but","my","have","s","this","their","are","me","on","him","people","then","so","not","when","were","had","king","what","by","we","at","said","one","has","t","do","son","out","if","there","no","or","land","like","us","must","these","up","those","her","day","our","now","man","into","am","can","come","let","because","go","about","against","give","down","even","don","an","over","other","she","before","made","been","men","its"};
const std::set<std::string> RCTStopwords(RCTStopwordsArray, RCTStopwordsArray + sizeof(RCTStopwordsArray) / sizeof(RCTStopwordsArray[0]));

jfieldID getEmdrosEnvField(JNIEnv *env, jobject obj) {
    jclass c = env->GetObjectClass(obj);
    // J is the type signature for long:
    return env->GetFieldID(c, "emdrosEnv", "J");
}

template <typename T>
T *getEmdrosEnv(JNIEnv *env, jobject obj) {
    jlong emdrosEnv = env->GetLongField(obj, getEmdrosEnvField(env, obj));
    return reinterpret_cast<T *>(emdrosEnv);
}

template <typename T>
void setEmdrosEnv(JNIEnv *env, jobject obj, T *t) {
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

static jobject makeIntegerObject(JNIEnv *env, int value) {
    jclass clazz = env->FindClass("java/lang/Integer");
    jmethodID integerConstructID = env->GetMethodID(clazz, "<init>", "(I)V");
    return env->NewObject(clazz, integerConstructID, value);
}

static jobject makeLongObject(JNIEnv *env, int64_t value) {
    jclass clazz = env->FindClass("java/lang/Long");
    jmethodID longConstructID = env->GetMethodID(clazz, "<init>", "(J)V");
    return env->NewObject(clazz, longConstructID, value);
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

jobject Java_com_sourceviewbible_emdros_Emdros_words(JNIEnv *env, jobject obj, jobjectArray jmonads, jlong jlimit, jboolean useStopWords) {
  EmdrosEnv *emdrosEnv = getEmdrosEnv<EmdrosEnv>(env, obj);

  jsize size = env->GetArrayLength(jmonads);
  SetOfMonads soms;
  for (int i = 0; i < size; i++) {
    jlongArray jmonad = static_cast<jlongArray>(env->GetObjectArrayElement(jmonads, i));
    if (jmonad) {
      jlong *monad = env->GetLongArrayElements(jmonad, 0);
      SetOfMonads som(monad[0], monad[1]);
      soms.unionWith(som);
      env->ReleaseLongArrayElements(jmonad, monad, 0);
      env->DeleteLocalRef(jmonad);
    }
  }

  std::set<std::string> stopwords;
  if (useStopWords) stopwords = RCTStopwords;

  std::string errorMessage;
  String2IntMap wordCountMap;
  bool result = getWordCountsInSOM(emdrosEnv, soms, stopwords, wordCountMap, errorMessage);

  jclass clazz = env->FindClass("java/util/HashMap");
  jmethodID init = env->GetMethodID(clazz, "<init>", "()V");
  jmethodID putMethod = env->GetMethodID(clazz, "put", "(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;");

  jobject words = env->NewObject(clazz, init);
  typedef std::map<std::string, int>::iterator iterator_type;
  for (iterator_type iterator = wordCountMap.begin(); iterator != wordCountMap.end(); ++iterator) {
    jstring word = env->NewStringUTF(iterator->first.c_str());
    jobject count = makeIntegerObject(env, iterator->second);
    env->CallObjectMethod(words, putMethod, word, count);

    env->DeleteLocalRef(word); word = NULL;
    env->DeleteLocalRef(count); count = NULL;
  }

  return words;
}

jobject Java_com_sourceviewbible_emdros_Emdros_wordCountsForContext(JNIEnv *env, jobject obj, jstring jcontext, jobjectArray jmonads, jstring jcontextFeatureComparison, jstring jtokenFeatureComparison) {
  EmdrosEnv *emdrosEnv = getEmdrosEnv<EmdrosEnv>(env, obj);

  jsize size = env->GetArrayLength(jmonads);
  SetOfMonads soms;
  for (int i = 0; i < size; i++) {
    jlongArray jmonad = static_cast<jlongArray>(env->GetObjectArrayElement(jmonads, i));
    if (jmonad) {
      jlong *monad = env->GetLongArrayElements(jmonad, 0);
      SetOfMonads som(monad[0], monad[1]);
      soms.unionWith(som);
      env->ReleaseLongArrayElements(jmonad, monad, 0);
      env->DeleteLocalRef(jmonad);
    }
  }

  std::string context;
  GetJStringContent(env, jcontext, context);

  std::string contextFeatureComparison;
  GetJStringContent(env, jcontextFeatureComparison, contextFeatureComparison);

  std::string tokenFeatureComparison;
  GetJStringContent(env, jtokenFeatureComparison, tokenFeatureComparison);

  std::string errorMessage;
  ID_D2WordCountsMap wordCountMap;
  bool result = getWordCountsInContext(emdrosEnv, soms, context, contextFeatureComparison, tokenFeatureComparison, wordCountMap, errorMessage);

  jclass clazz = env->FindClass("java/util/HashMap");
  jmethodID init = env->GetMethodID(clazz, "<init>", "()V");
  jmethodID putMethod = env->GetMethodID(clazz, "put", "(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;");

  jobject wordCounts = env->NewObject(clazz, init);
  typedef ID_D2WordCountsMap::iterator iterator_type;
  for (iterator_type iterator = wordCountMap.begin(); iterator != wordCountMap.end(); ++iterator) {
    jobject contextID = makeLongObject(env, iterator->first);

    jobject wordCount = env->NewObject(clazz, init);
    env->CallObjectMethod(wordCount, putMethod, env->NewStringUTF("wordCount"), makeIntegerObject(env, iterator->second.m_word_count));
    env->CallObjectMethod(wordCount, putMethod, env->NewStringUTF("family"), makeIntegerObject(env, iterator->second.m_Family));
    env->CallObjectMethod(wordCount, putMethod, env->NewStringUTF("economics"), makeIntegerObject(env, iterator->second.m_Economics));
    env->CallObjectMethod(wordCount, putMethod, env->NewStringUTF("government"), makeIntegerObject(env, iterator->second.m_Government));
    env->CallObjectMethod(wordCount, putMethod, env->NewStringUTF("religion"), makeIntegerObject(env, iterator->second.m_Religion));
    env->CallObjectMethod(wordCount, putMethod, env->NewStringUTF("education"), makeIntegerObject(env, iterator->second.m_Education));
    env->CallObjectMethod(wordCount, putMethod, env->NewStringUTF("communication"), makeIntegerObject(env, iterator->second.m_MediaCom));
    env->CallObjectMethod(wordCount, putMethod, env->NewStringUTF("celebration"), makeIntegerObject(env, iterator->second.m_Celebration));
    env->CallObjectMethod(wordCounts, putMethod, contextID, wordCount);

    env->DeleteLocalRef(contextID);
    env->DeleteLocalRef(wordCount);
  }

  return wordCounts;
}


void Java_com_sourceviewbible_emdros_Emdros_dispose(JNIEnv *env, jobject obj) {
  // EmdrosEnv *emdrosEnv = getEmdrosEnv<EmdrosEnv>(env, obj);
  // setEmdrosEnv(env, obj, 0);
  // delete emdrosEnv;
}
