/*
 * bucket.h - Buckets for counting.
 *
 * Copyright (C) 2016 SourceView LLC. All rights reserved.
 *
 * Created: 2016/03/31
 * Last update: 2016/03/31
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
	kBKBucket
} eBucketKind;

/*
 * SELECT ALL OBJECTS
 * WHERE
 * [Source GET source_color
 *    [Token GET surface is_word = true AND Family = true]
 * ]
 * GO
 *
 *
 */

class Bucket; // Forward declaration
typedef std::map<std::string, Bucket*> String2PBucketMap;

class BucketConstIterator; // Forward declaration

/*
 * The Bucket data structure is designed to facilitate counting of
 * items in a Sheaf arising from a SELECT ALL OBJECTS Emdros query.
 *
 * The Bucket is a recursive data structure defined as follows:
 *
 * A bucket is either:
 *
 * a) A count of something, or
 *
 * b) An associative map mapping feature values to Bucket objects.
 *
 * Additionally, the MonadRange2BucketMap structure (called a "map of
 * bins", since a bin is larger than a bucket), is designed to "bin"
 * buckets by ranges of monads.
 *
 * The idea is, if you want to group Buckets by, say, chapters, then
 * you first run a query to retrieve all Chapter objects in a given
 * monad range (say, a Book), then you add the monad range of each
 * Chapter object to the MonadRange2BucketMap, and only then do you
 * traverse the Sheaf of the query you are interested in counting.
 * While traversing the Sheaf to be counted, the MonadRange2BucketMap
 * is used to hold, create, and retrieve the Buckets which are to hold
 * each path from the outermost object block level to the innermost.
 *
 * For example, say you want to count the Tokens of a given book,
 * group them by Source color, and additionally group the sources by
 * chapters.  Additionally, say you'd want to do this for the book of
 * Job. Here is what you'd do:
 *
 * monad_m book_first_monad = 0;
 * monad_m book_last_monad = 0;
 *
 * // Defined in harvest.cpp.
 * if (!getMonadsForBook(pEE, "Job", book_first_monad, book_last_monad)) {
 * 	// Error.
 * }  else {
 * 	// Now get the BucketMap.
 * 	SetOfMonads book_som(book_first_monad, book_last_monad);
 * 	
 * 	bool bResult = false;
 * 	MonadRange2BucketMap *pBucketMap =
 * 		getBucketMapFromParams(pEE,
 * 				       "chapter", // bin object type name
 * 				       "chapter", // bin feature name
 * 				       book_som,
 * 				       bResult);
 * 	
 * 	if (!bResult) {
 * 		// Error
 * 	} else {
 * 		query = "SELECT ALL OBJECTS IN" + book_som.toString();
 * 		query += "WHERE [Source GET source_color [Token]]GO";
 *  
 * 		if (!pEE->executeString(query, bResult, false, false)) {
 * 			// Error
 * 		} else {
 * 			Sheaf *pSheaf = pEE->takeOverSheaf();
 * 
 * 			countInSheaf(pSheaf, pBucketMap);
 * 
 * 			delete pSheaf;
 * 
 * 			return pBucketMap;
 * 		}
 * 	}
 * }
 *
 */
class Bucket {
 protected:
	friend class BucketConstIterator;
	
	long m_kind_or_count; // -1 means BucketBucket, >= 0 means count bucket
	String2PBucketMap *m_bucket_map;
 public:
	Bucket(eBucketKind kind);
	~Bucket();

	Bucket *getBucket(const std::string& feature, eBucketKind kind);
	long incrementCount();

	long getCount() const;

	long getRecursiveCount() const;

	eBucketKind getKind() const { return (m_kind_or_count < 0) ? kBKBucket : kBKCount; };

	void prettyPrint(std::ostream& out, int indent = 0) const;

	void getJSONInBigstring(Bigstring *pResult) const;
};

/** A const iterator for a Bucket of kind kBKBucket.
 *
 * Here is how you could use it:
 *
 * BucketConstIterator bucket_it(pBucket);
 * while (bucket_it.hasNext()) {
 *	std::pair<std::string, const Bucket*> mypair = bucket_it.next();
 *
 *	std::string feature = mypair.first;
 *	const Bucket *pInnerBucket = mypair.second;
 *
 *	// Do something with the pInnerBucket and/or feature, such as
 *	// getting the kind with pInnerBucket->getKind(), getting the
 *	// count (if pInnerBucket is of kind kBKCount) recursing, or
 *	// some such.
 * }
 *
 */
class BucketConstIterator {
	const Bucket *m_mother_bucket;
	String2PBucketMap::const_iterator m_it;
	String2PBucketMap::const_iterator m_end;
 public:
	BucketConstIterator(const Bucket *pMotherBucket);
	~BucketConstIterator();

	bool hasNext() const;
	std::pair<std::string, const Bucket*> next();
	std::pair<std::string, const Bucket*> current() const;
};

class MonadRange2BucketMapConstIterator;

typedef std::map<monad_m, Bucket*> Monad2PBucketMap;
typedef std::map<monad_m, monad_m> Monad2MonadMap;
typedef std::map<monad_m, std::string> Monad2StringMap;

/** A class to have one or more "bins", where each "bin" represents a
 * range of monads pointing to a Bucket.
 *
 * The MonadRange2BucketMap must be populated with monad ranges
 * *before* getting any Buckets, using the
 * MonadRange2BucketMap::addRange() method.
 *
 * @see Bucket for an explanation of how to create a
 * MonadRange2BucketMap.
 *
 */
class MonadRange2BucketMap {
 protected:
	friend class MonadRange2BucketMapConstIterator;
	
	Monad2PBucketMap m_bucket_map;
	Monad2MonadMap m_monad_range_map;
	Monad2StringMap m_name_map;
 public:
	MonadRange2BucketMap();
	~MonadRange2BucketMap();

	void addRange(monad_m first_monad, monad_m last_monad, const std::string& name);

	Bucket *getBucket(monad_m monad, eBucketKind kind);

	const Bucket *findConstBucket(monad_m monad) const;

	std::string findName(monad_m monad) const;

	monad_m findFirstMonad(monad_m monad) const;

	void prettyPrint(std::ostream& out, int indent = 0) const;

	std::string getJSON() const;
 protected:
	void getBinJSONInBigstring(Bigstring *pResult, const Bucket *pBucket, monad_m first_monad, monad_m last_monad) const;
};

/** Class to iterate over the bins in a MonadRange2BucketMap.
 *
 * @see BucketConstIterator for a general overview of how to use.
 *
 */
class MonadRange2BucketMapConstIterator {
 protected:
	const MonadRange2BucketMap *m_mother_bucket_map;
	Monad2MonadMap::const_iterator m_it;
	Monad2MonadMap::const_iterator m_end;
 public:
	MonadRange2BucketMapConstIterator(const MonadRange2BucketMap *mother_bucket_map);
	~MonadRange2BucketMapConstIterator();

	bool hasNext() const;
	std::pair<monad_m, monad_m> next();
	std::pair<monad_m, monad_m> current() const;
};


void countInSheaf(const Sheaf *pSheaf, MonadRange2BucketMap *pBucketMap);

MonadRange2BucketMap *makeBucketMapFromSheaf(const Sheaf *pSheaf);

MonadRange2BucketMap *getBucketMapFromParams(EmdrosEnv *pEE, const std::string& bin_otn, const std::string& bin_feature_name, const SetOfMonads& in_som, bool& bResult);


#endif /* !defined(BUCKET_H_) */

