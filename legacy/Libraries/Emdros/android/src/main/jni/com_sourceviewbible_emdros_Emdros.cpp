#include "com_sourceviewbible_emdros_Emdros.h"
#include "emdros.h"
#include "bucket.h"
#include "harvest.h"
#include <fstream>
#include <sstream>

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
  try {
    std::string rendered_objects = render_objects(emdrosEnv, dbName, stylesheet, stylesheetName, (long)from, (long)to, bResult);
    return env->NewStringUTF(rendered_objects.c_str());
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
  return env->NewStringUTF("");
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
      env->DeleteLocalRef(jmonad); jmonad = NULL;
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

  jclass integerClazz = env->FindClass("java/lang/Integer");
  jmethodID integerConstructID = env->GetMethodID(integerClazz, "<init>", "(I)V");

  jobject words = env->NewObject(clazz, init);
  typedef std::map<std::string, int>::iterator iterator_type;
  for (iterator_type iterator = wordCountMap.begin(); iterator != wordCountMap.end(); ++iterator) {
    jstring word = env->NewStringUTF(iterator->first.c_str());
    jobject count = env->NewObject(integerClazz, integerConstructID, iterator->second);
    jobject wordPut = env->CallObjectMethod(words, putMethod, word, count);
    env->DeleteLocalRef(word); word = NULL;
    env->DeleteLocalRef(count); count = NULL;
    env->DeleteLocalRef(wordPut); wordPut = NULL;
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
      env->DeleteLocalRef(jmonad); jmonad = NULL;
    }
  }

  std::string context;
  GetJStringContent(env, jcontext, context);

  std::string contextFeatureComparison;
  GetJStringContent(env, jcontextFeatureComparison, contextFeatureComparison);

  std::string tokenFeatureComparison;
  GetJStringContent(env, jtokenFeatureComparison, tokenFeatureComparison);

  std::string errorMessage;
  ID_D2WordCountsMap wordCountsMap;
  bool result = getWordCountsInContext(emdrosEnv, soms, context, contextFeatureComparison, tokenFeatureComparison, wordCountsMap, errorMessage);

  jclass hashmapClazz = env->FindClass("java/util/HashMap");
  jmethodID hashMapInit = env->GetMethodID(hashmapClazz, "<init>", "()V");
  jmethodID putMethod = env->GetMethodID(hashmapClazz, "put", "(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;");

  jclass integerClazz = env->FindClass("java/lang/Integer");
  jmethodID integerConstructID = env->GetMethodID(integerClazz, "<init>", "(I)V");

  jobject wordCountKey = env->NewStringUTF("wordCount");
  jobject familyKey = env->NewStringUTF("family");
  jobject economicsKey = env->NewStringUTF("economics");
  jobject governmentKey = env->NewStringUTF("government");
  jobject religionKey = env->NewStringUTF("religion");
  jobject educationKey = env->NewStringUTF("education");
  jobject communicationKey = env->NewStringUTF("communication");
  jobject celebrationKey = env->NewStringUTF("celebration");

  jobject wordCounts = env->NewObject(hashmapClazz, hashMapInit);
  typedef ID_D2WordCountsMap::iterator iterator_type;
  for (iterator_type iterator = wordCountsMap.begin(); iterator != wordCountsMap.end(); ++iterator) {
    std::string contextIDString;
    std::stringstream strstream;
    strstream << iterator->first;
    strstream >> contextIDString;
    jobject contextID = env->NewStringUTF(contextIDString.c_str());

    jobject wordCountMap = env->NewObject(hashmapClazz, hashMapInit);

    // LOGV("iterating results wordCount... %i", iterator->second.m_word_count);
    jobject wordCount = env->NewObject(integerClazz, integerConstructID, iterator->second.m_word_count);
    jobject wordCountPut = env->CallObjectMethod(wordCountMap, putMethod, wordCountKey, wordCount);
    env->DeleteLocalRef(wordCount); wordCount = NULL;
    env->DeleteLocalRef(wordCountPut); wordCountPut = NULL;
    // LOGV("iterated results wordCount...");

    // LOGV("iterating results familyCount... %i", iterator->second.m_Family);
    jobject familyCount = env->NewObject(integerClazz, integerConstructID, iterator->second.m_Family);
    jobject familyCountPut = env->CallObjectMethod(wordCountMap, putMethod, familyKey, familyCount);
    env->DeleteLocalRef(familyCount); familyCount = NULL;
    env->DeleteLocalRef(familyCountPut); familyCountPut = NULL;
    // LOGV("iterated results familyCount...");

    // LOGV("iterating results economicsCount... %i", iterator->second.m_Economics);
    jobject economicsCount = env->NewObject(integerClazz, integerConstructID, iterator->second.m_Economics);
    jobject economicsCountPut = env->CallObjectMethod(wordCountMap, putMethod, economicsKey, economicsCount);
    env->DeleteLocalRef(economicsCount); economicsCount = NULL;
    env->DeleteLocalRef(economicsCountPut); economicsCountPut = NULL;
    // LOGV("iterated results economicsCount...");

    // LOGV("iterating results governmentCount... %i", iterator->second.m_Government);
    jobject governmentCount = env->NewObject(integerClazz, integerConstructID, iterator->second.m_Government);
    jobject governmentCountPut = env->CallObjectMethod(wordCountMap, putMethod, governmentKey, governmentCount);
    env->DeleteLocalRef(governmentCount); governmentCount = NULL;
    env->DeleteLocalRef(governmentCountPut); governmentCountPut = NULL;
    // LOGV("iterated results governmentCount...");

    // LOGV("iterating results religionCount... %i", iterator->second.m_Religion);
    jobject religionCount = env->NewObject(integerClazz, integerConstructID, iterator->second.m_Religion);
    jobject religionCountPut = env->CallObjectMethod(wordCountMap, putMethod, religionKey, religionCount);
    env->DeleteLocalRef(religionCount); religionCount = NULL;
    env->DeleteLocalRef(religionCountPut); religionCountPut = NULL;
    // LOGV("iterated results religionCount...");

    // LOGV("iterating results educationCount... %i", iterator->second.m_Education);
    jobject educationCount = env->NewObject(integerClazz, integerConstructID, iterator->second.m_Education);
    jobject educationCountPut = env->CallObjectMethod(wordCountMap, putMethod, educationKey, educationCount);
    env->DeleteLocalRef(educationCount); educationCount = NULL;
    env->DeleteLocalRef(educationCountPut); educationCountPut = NULL;
    // LOGV("iterated results educationCount...");

    // LOGV("iterating results communicationCount... %i", iterator->second.m_MediaCom);
    jobject communicationCount = env->NewObject(integerClazz, integerConstructID, iterator->second.m_MediaCom);
    jobject communicationCountPut = env->CallObjectMethod(wordCountMap, putMethod, communicationKey, communicationCount);
    env->DeleteLocalRef(communicationCount); communicationCount = NULL;
    env->DeleteLocalRef(communicationCountPut); communicationCountPut = NULL;
    // LOGV("iterated results communicationCount...");

    // LOGV("iterating results celebrationCount... %i", iterator->second.m_Celebration);
    jobject celebrationCount = env->NewObject(integerClazz, integerConstructID, iterator->second.m_Celebration);
    jobject celebrationCountPut = env->CallObjectMethod(wordCountMap, putMethod, celebrationKey, celebrationCount);
    env->DeleteLocalRef(celebrationCount); celebrationCount = NULL;
    env->DeleteLocalRef(celebrationCountPut); celebrationCountPut = NULL;
    // LOGV("iterated results celebrationCount...");

    // LOGV("iterating results wordCountMap...");
    jobject wordCountMapPut = env->CallObjectMethod(wordCounts, putMethod, contextID, wordCountMap);
    env->DeleteLocalRef(contextID); contextID = NULL;
    env->DeleteLocalRef(wordCountMap); wordCountMap = NULL;
    env->DeleteLocalRef(wordCountMapPut); wordCountMapPut = NULL;
    // LOGV("iterated results wordCountMap...");
  }

  env->DeleteLocalRef(wordCountKey); wordCountKey = NULL;
  env->DeleteLocalRef(familyKey); familyKey = NULL;
  env->DeleteLocalRef(economicsKey); economicsKey = NULL;
  env->DeleteLocalRef(governmentKey); governmentKey = NULL;
  env->DeleteLocalRef(religionKey); religionKey = NULL;
  env->DeleteLocalRef(educationKey); educationKey = NULL;
  env->DeleteLocalRef(communicationKey); communicationKey = NULL;
  env->DeleteLocalRef(celebrationKey); celebrationKey = NULL;

  return wordCounts;
}

jobject Java_com_sourceviewbible_emdros_Emdros_wordOccurrencesForQuery(JNIEnv *env, jobject obj, jstring jquery) {
  EmdrosEnv *emdrosEnv = getEmdrosEnv<EmdrosEnv>(env, obj);

  std::string query;
  GetJStringContent(env, jquery, query);

  std::string errorMessage;
  WordOccurrenceSet wordOccurrenceSet;
  bool result = getWordOccurrencesForQuery(emdrosEnv, query, wordOccurrenceSet, errorMessage);

  jclass hashmapClazz = env->FindClass("java/util/HashMap");
  jmethodID hashMapInit = env->GetMethodID(hashmapClazz, "<init>", "()V");
  jmethodID putMethod = env->GetMethodID(hashmapClazz, "put", "(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;");

  jclass integerClazz = env->FindClass("java/lang/Integer");
  jmethodID integerConstructID = env->GetMethodID(integerClazz, "<init>", "(I)V");

  jobject idKey = env->NewStringUTF("id");
  jobject DJHRefKey = env->NewStringUTF("DJHRef");
  jobject chapterKey = env->NewStringUTF("chapter");
  jobject verseKey = env->NewStringUTF("verse");
  jobject roleIDKey = env->NewStringUTF("roleID");
  jobject nameKey = env->NewStringUTF("name");
  jobject numberKey = env->NewStringUTF("number");
  jobject monadKey = env->NewStringUTF("monad");
  jobject firstMonadKey = env->NewStringUTF("firstMonad");
  jobject lastMonadKey = env->NewStringUTF("lastMonad");

  jobject wordOccurrences = env->NewObject(hashmapClazz, hashMapInit);
  for (WordOccurrenceSet::const_iterator iterator = wordOccurrenceSet.begin(); iterator != wordOccurrenceSet.end(); ++iterator) {
    WordOccurrence wordOccurrence = *iterator;

    jobject id = env->NewObject(integerClazz, integerConstructID, wordOccurrence.m_monad);

    jobject wordOccurrenceMap = env->NewObject(hashmapClazz, hashMapInit);

    jobject idPut = env->CallObjectMethod(wordOccurrenceMap, putMethod, idKey, id);
    env->DeleteLocalRef(idPut); idPut = NULL;

    jobject DJHRef = env->NewStringUTF(wordOccurrence.m_DJHRef.c_str());
    jobject DJHRefPut = env->CallObjectMethod(wordOccurrenceMap, putMethod, DJHRefKey, DJHRef);
    env->DeleteLocalRef(DJHRef); DJHRef = NULL;
    env->DeleteLocalRef(DJHRefPut); DJHRefPut = NULL;

    jobject chapter = env->NewObject(integerClazz, integerConstructID, wordOccurrence.m_chapter);
    jobject chapterPut = env->CallObjectMethod(wordOccurrenceMap, putMethod, chapterKey, chapter);
    env->DeleteLocalRef(chapter); chapter = NULL;
    env->DeleteLocalRef(chapterPut); chapterPut = NULL;

    jobject verse = env->NewObject(integerClazz, integerConstructID, wordOccurrence.m_verse);
    jobject versePut = env->CallObjectMethod(wordOccurrenceMap, putMethod, verseKey, verse);
    env->DeleteLocalRef(verse); verse = NULL;
    env->DeleteLocalRef(versePut); versePut = NULL;

    jobject roleID = env->NewObject(integerClazz, integerConstructID, wordOccurrence.m_role);
    jobject roleIDPut = env->CallObjectMethod(wordOccurrenceMap, putMethod, roleIDKey, roleID);
    env->DeleteLocalRef(roleID); roleID = NULL;
    env->DeleteLocalRef(roleIDPut); roleIDPut = NULL;

    jobject name = env->NewStringUTF(wordOccurrence.m_source_name.c_str());
    jobject namePut = env->CallObjectMethod(wordOccurrenceMap, putMethod, nameKey, name);
    env->DeleteLocalRef(name); name = NULL;
    env->DeleteLocalRef(namePut); namePut = NULL;

    jobject number = env->NewObject(integerClazz, integerConstructID, wordOccurrence.m_source_occurrence);
    jobject numberPut = env->CallObjectMethod(wordOccurrenceMap, putMethod, numberKey, number);
    env->DeleteLocalRef(number); number = NULL;
    env->DeleteLocalRef(numberPut); numberPut = NULL;

    jobject monad = env->NewObject(integerClazz, integerConstructID, wordOccurrence.m_monad);
    jobject monadPut = env->CallObjectMethod(wordOccurrenceMap, putMethod, monadKey, monad);
    env->DeleteLocalRef(monad); monad = NULL;
    env->DeleteLocalRef(monadPut); monadPut = NULL;

    jobject firstMonad = env->NewObject(integerClazz, integerConstructID, wordOccurrence.m_first_monad);
    jobject firstMonadPut = env->CallObjectMethod(wordOccurrenceMap, putMethod, firstMonadKey, firstMonad);
    env->DeleteLocalRef(firstMonad); firstMonad = NULL;
    env->DeleteLocalRef(firstMonadPut); firstMonadPut = NULL;

    jobject lastMonad = env->NewObject(integerClazz, integerConstructID, wordOccurrence.m_last_monad);
    jobject lastMonadPut = env->CallObjectMethod(wordOccurrenceMap, putMethod, lastMonadKey, lastMonad);
    env->DeleteLocalRef(lastMonad); lastMonad = NULL;
    env->DeleteLocalRef(lastMonadPut); lastMonadPut = NULL;

    jobject wordOccurrenceMapPut = env->CallObjectMethod(wordOccurrences, putMethod, id, wordOccurrenceMap);
    env->DeleteLocalRef(id); id = NULL;
    env->DeleteLocalRef(wordOccurrenceMap); wordOccurrenceMap = NULL;
    env->DeleteLocalRef(wordOccurrenceMapPut); wordOccurrenceMapPut = NULL;
  }

  env->DeleteLocalRef(idKey); idKey = NULL;
  env->DeleteLocalRef(DJHRefKey); DJHRefKey = NULL;
  env->DeleteLocalRef(chapterKey); chapterKey = NULL;
  env->DeleteLocalRef(verseKey); verseKey = NULL;
  env->DeleteLocalRef(roleIDKey); roleIDKey = NULL;
  env->DeleteLocalRef(nameKey); nameKey = NULL;
  env->DeleteLocalRef(numberKey); numberKey = NULL;
  env->DeleteLocalRef(monadKey); monadKey = NULL;
  env->DeleteLocalRef(firstMonadKey); firstMonadKey = NULL;
  env->DeleteLocalRef(lastMonadKey); lastMonadKey = NULL;

  return wordOccurrences;
}


void Java_com_sourceviewbible_emdros_Emdros_dispose(JNIEnv *env, jobject obj) {
  // EmdrosEnv *emdrosEnv = getEmdrosEnv<EmdrosEnv>(env, obj);
  // setEmdrosEnv(env, obj, 0);
  // delete emdrosEnv;
}
