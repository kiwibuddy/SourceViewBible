#ifndef _RCTEMDROSENV_H_INCLUDED_
#define _RCTEMDROSENV_H_INCLUDED_

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

#endif
