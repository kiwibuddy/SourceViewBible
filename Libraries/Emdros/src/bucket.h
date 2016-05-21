/*
 * bucket.h - Buckets for counting.
 *
 * Copyright (C) 2016 SourceView LLC. All rights reserved.
 *
 * Created: 2016/03/31
 * Last update: 2016/05/20
 *
 * Contributors:
 *
 * Ulrik Sandborg-Petersen
 * Jonathan Younger
 *
 */

#ifndef BUCKET_H_
#define BUCKET_H_

#include <map>
#include <ostream>
#include <string>

#include "emdros.h"

typedef enum {
	kBKCount,
	kBKBucket,
	kBKBin
} eBucketKind;


class Bucket; // Forward declaration
typedef std::set<std::string> StringSet;
typedef std::map<std::string, StringSet> String2StringSetMap;
typedef std::map<monad_m, String2StringSetMap> Monad2String2StringSetMap;

typedef std::map<std::string, Bucket*> String2PBucketMap;
typedef std::map<std::string, String2PBucketMap> String2String2PBucketMap;


class BucketValue {
 public:
	const std::string m_object_type_name;
	const std::string m_feature_name;
	const std::string m_feature_value;
	const monad_m m_first_monad;
	const monad_m m_last_monad;
	const eBucketKind m_bucket_kind;
	BucketValue(const std::string& object_type_name,
		    const std::string& feature_name,
		    const std::string& feature_value,
		    monad_m first_monad,
		    monad_m last_monad,
		    eBucketKind bucket_kind);
	BucketValue(const BucketValue& other);
	~BucketValue();
};


/*
 * The Bucket data structure is designed to facilitate counting of
 * items in an Emdros database.
 *
 * The Bucket is a recursive data structure defined as follows:
 *
 * A Bucket is either:
 *
 * a) kBKCount: An integer count.
 *
 * b) kBKBucket: An associative map mapping feature names to an
 * associative map mapping feature values to integer counts.
 * Additionally, a Bucket of kind kBKBucket has an object type name as
 * a field.
 *
 * c) kBKBin: A data structure which has the same information as a
 * kBKBucket, but also takes a monad range in order to know which
 * inner Bucket to put something into.  That is, a kBKBin decides
 * which inner bucket to put something into primarily by means of a
 * monad range, and secondarily by means of a feature name and value.
 *
 */
class Bucket {
 protected:
	long m_kind_or_count; // -2 == kBKBin, -1 == kBKBucket, >= 0 == KBKCount
 public:
	Bucket(eBucketKind bucket_kind);
	virtual ~Bucket();

	static Bucket *newBucket(eBucketKind bucket_kind, const std::string& object_type_name);
	
	virtual eBucketKind getKind() const;

	virtual void addBucketValue(const BucketValue& bv, eBucketKind child_bucket_kind, const std::string& child_object_type_name);

	virtual void getBucketListFromMonad(const BucketValue& bv, int depth, eBucketKind child_bucket_kind, const std::string& child_object_type_name, std::list<Bucket*>& /* out */ bucket_list);
	
	virtual void incrementCountInChild(const BucketValue& bv);

	virtual void incrementCount();

	virtual long getCount() const;

	virtual void prettyPrint(std::ostream& out, int indent = 0) const;

	virtual std::string getJSON() const;

	virtual void getJSONInBigstring(Bigstring *pResult) const;

};


class BinBucket : public Bucket {
 protected:
	std::string m_object_type_name;
	Monad2String2StringSetMap m_monad_map;
	String2String2PBucketMap m_feature_map;	
 public:
	BinBucket(eBucketKind newKind, const std::string& object_type_name);

	virtual ~BinBucket();

	virtual void addBucketValue(const BucketValue& bv, eBucketKind child_bucket_kind, const std::string& child_object_type_name);

	virtual void incrementCountInChild(const BucketValue& bv);

	virtual void prettyPrint(std::ostream& out, int indent = 0) const;

	virtual void getJSONInBigstring(Bigstring *pResult) const;

	virtual void getBucketListFromMonad(const BucketValue& bv, int depth, eBucketKind child_bucket_kind, const std::string& child_object_type_name, std::list<Bucket*>& /* out */ bucket_list);

	virtual Bucket *getBucketFromFeatureNameAndValue(const std::string& feature_name, const std::string& feature_value);

	virtual void getBucketListFromFeatureName(const std::string& feature_name, std::list<Bucket*>& feature_bucket_list);
};




Bucket *getBucketFromJSONBucketSpecification(EmdrosEnv *pEnv, const std::string& json_string, const SetOfMonads& substrate, std::string& error_message);

#endif /* !defined(BUCKET_H_) */



