/*
 * bucket.cpp - Buckets for counting.
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

#include "bucket.h"

#include <list>

/////////////////////////////////////////////////////////////////
//
// Bucket
//
/////////////////////////////////////////////////////////////////
/** Bucket constructor. Constructs an empty Bucket.
 * 
 * Although the user can create their own Bucket objects, the normal
 * way to create Buckets is to let MonadRange2BucketMap::getBucket()
 * method do it.
 *
 *
 * A Bucket can be of two kinds:
 *
 * a) kBKCount : A count of objects.
 *
 * b) kBKBucket : A map of strings to Bucket objects.
 *
 * @param kind The eBucketKind bucket kind, which must be either
 * kBKCount or kBKBucket.
 *
 */
Bucket::Bucket(eBucketKind kind)
{
	if (kind == kBKBucket) {
		m_kind_or_count = -1L;
	} else {
		m_kind_or_count = 0;
	}

	switch (kind) {
	case kBKCount:
		m_bucket_map = 0;
		break;
	case kBKBucket:
		m_bucket_map = new String2PBucketMap();
		break;
	default:
		throw EmdrosException("Implementation error: Unknown eBucketKind. Please implement support for this eBucketKind.");
		break;
	}
}

/** Bucket destructor.
 *
 * If this Bucket is of kind kBKBucket, then, additionally, it calls
 * the destructor of all inner Bucket objects.
 *
 */
Bucket::~Bucket()
{
	switch (getKind()) {
	case kBKCount:
		break;
	case kBKBucket:
		{
			String2PBucketMap::iterator it = m_bucket_map->begin();
			while (it != m_bucket_map->end()) {
				Bucket *pBucket = it->second;
				delete pBucket;
				++it;
			}
			m_bucket_map->clear();
			delete m_bucket_map;
		}
		break;
	default:
		throw EmdrosException("Implementation error: Unknown eBucketKind. Please implement support for this eBucketKind.");
		break;
	}
}


/** Retrieve the inner Bucket for a given feature value.  If such a
 * bucket does not yet exist, create it and add it to the Bucket map.
 * The kind of bucket to be created must be given in the "kind"
 * parameter.
 *
 * Note that this method is only valid to call if and only if this
 * Bucket is of kind kBKBucket.  Otherwise, an EmdrosException is
 * thrown.
 *
 * This Bucket owns the created/retrieved Bucket.  Do not attempt to
 * delete the inner Bucket except through a call to this Bucket's
 * destructor.
 *
 * @param feature The string value to look up in the Bucket map.
 *
 * @param kind The eBucketKind value to use if the "feature" parameter
 * does not have an associated Bucket yet.  The "kind" bucket kind is
 * passed to the Bucket constructor for the new Bucket.
 *
 * @return A pointer to the bucket either newly created or retrieved
 * for the feature value given.
 *
 */
Bucket *Bucket::getBucket(const std::string& feature, eBucketKind kind)
{
	ASSERT_THROW(getKind() == kBKBucket, "Logic error: this bucket kind != kBKBucket in Bucket::getBucket(\"" + feature + "\").");
	String2PBucketMap::iterator it = m_bucket_map->find(feature);
	if (it == m_bucket_map->end()) {
		// It wasn't there already.
		Bucket *pInnerBucket = new Bucket(kind);
		m_bucket_map->insert(std::make_pair(feature, pInnerBucket));
		return pInnerBucket;
	} else {
		// It was there already.
		Bucket *pInnerBucket = it->second;
		return pInnerBucket;
	}
}


/** Increment the count of a kBKCount bucket.
 *
 * Note that the Bucket MUST be of kind kBKCount, otherwise an
 * EmdrosException is thrown.
 *
 * @return The value of the Bucket's count, after incrementing.
 *
 */
long Bucket::incrementCount()
{
	ASSERT_THROW(getKind() == kBKCount, "Logic error: this bucket kind != kBKCount in Bucket::incrementCount().");
	++m_kind_or_count;
	return m_kind_or_count;
}


/** Get the current count of this kBKCount bucket.
 *
 *
 * Note that the Bucket MUST be of kind kBKCount, otherwise an
 * EmdrosException is thrown.
 *
 * @return The current value of the Bucket's count.
 *
 */
long Bucket::getCount() const
{
	ASSERT_THROW(getKind() == kBKCount, "Logic error: this bucket kind != kBKCount in Bucket::incrementCount().");
	return m_kind_or_count;
}


/** Get the sum of the counts of this Bucket and any inner Buckets.
 *
 * If this Bucket is a kBKCount bucket, return the current count.
 *
 * Otherwise, if this Bucket is a kBKBucket bucket, return the sum of
 * all of the counts of the inner Buckets.
 *
 * @return The recursively created sum of all counts in the Bucket.
 */
long Bucket::getRecursiveCount() const
{
	long result_count = 0;
	switch (getKind()) {
	case kBKCount:
		result_count = m_kind_or_count;
		break;
	case kBKBucket:
		{
			String2PBucketMap::iterator it = m_bucket_map->begin();
			while (it != m_bucket_map->end()) {
				Bucket *pBucket = it->second;
				result_count += pBucket->getRecursiveCount();
				++it;
			}
		}
		break;
	default:
		throw EmdrosException("Implementation error: Unknown eBucketKind. Please implement support for this eBucketKind.");
		break;
	}
	return result_count;
}

/** Helper function to print an indent to a std::ostream.
 *@internal
 *
 * @param out The std::ostream to which to print the indent.
 *
 * @param indent The number of indents to make. Each indent is 4
 * spaces long.
 */
void local_print_indent(std::ostream& out, int indent)
{
	for (int i = 0;
	     i < indent;
	     ++i) {
		out << "    ";
	}
}

#define ADD_STRING(STR) pResult->addCharsSimple(STR, sizeof(STR)-1);

/** Create a JSON representation of this Bucket.
 * @internal
 *
 * This function is not meant to be called by the user.
 *
 * The "pResult" parameter is a Bigstring, implemented in Emdros's
 * arena.h include file.
 *
 * @param pResult The Bigstring to which to print the JSON
 * representaion.
 */
void Bucket::getJSONInBigstring(Bigstring *pResult) const
{
	std::string tmpStr;
	switch (getKind()) {
	case kBKCount:
		tmpStr = long2string(m_kind_or_count);
		pResult->addCharsSimple(tmpStr.c_str(), tmpStr.length());
		break;
	case kBKBucket:
		{
			// recursiveCount
			ADD_STRING("{\"recursiveCount\":");
			tmpStr = long2string(getRecursiveCount());
			pResult->addCharsSimple(tmpStr.c_str(), tmpStr.length());
			ADD_STRING(",\"bucket\":{");
			BucketConstIterator ci = BucketConstIterator(this);
			while (ci.hasNext()) {
				std::pair<std::string, const Bucket*> mypair = ci.next();
				pResult->addChar('"');
				tmpStr = encodeSTRINGstring(mypair.first); // FIXME: Do JSON escaping, not MQL escaping!
				pResult->addCharsSimple(tmpStr.c_str(), tmpStr.length());
				ADD_STRING("\":");

				const Bucket* pInnerBucket = mypair.second;

				pInnerBucket->getJSONInBigstring(pResult);

				// If we didn't reach the last, then add
				// a comma
				if (ci.hasNext()) {
					pResult->addChar(',');
				} else {
					// ; // Nothing to do
				}
			}
			ADD_STRING("}}");
		}
		break;
	default:
		throw EmdrosException("Implementation error: Unknown eBucketKind. Please implement support for this eBucketKind.");
		break;
	}
}

/**
 * Utility function to pretty print a Bucket.
 *
 * @param out The std::ostream to which to pretty print the Bucket.
 *
 * @param indent The level of indentation to use for this Bucket.
 *
 */
void Bucket::prettyPrint(std::ostream& out, int indent) const
{
	switch (getKind()) {
	case kBKCount:
		out << m_kind_or_count;
		break;
	case kBKBucket:
		{
			out << " Bucket(count= " << this->getRecursiveCount() << "){\n";
			
			BucketConstIterator ci = BucketConstIterator(this);
			while (ci.hasNext()) {
				std::pair<std::string, const Bucket*> mypair = ci.next();
				local_print_indent(out, indent+1);
				out << "\"" << mypair.first << "\" : "; 
				mypair.second->prettyPrint(out, indent+1);
				out << "\n";
			}
			local_print_indent(out, indent);
			out << "}\n";
		}
		break;
	default:
		throw EmdrosException("Implementation error: Unknown eBucketKind. Please implement support for this eBucketKind.");
		break;
	}
}







/////////////////////////////////////////////////////////////////
//
// BucketConstIterator
//
/////////////////////////////////////////////////////////////////
/** The BucketConstIterator constructor.
 *
 * Call this with a pointer to the Bucket over which you want to iterate.
 * 
 * @param pMotherBucket The Bucket over which we want to iterate.
 *
 */
BucketConstIterator::BucketConstIterator(const Bucket *pMotherBucket)
{
	ASSERT_THROW(pMotherBucket->getKind() == kBKBucket,
		     "Logic error: Trying to use BucketConstIterator on a Bucket which isn't of kind kBKBucket.");
	m_mother_bucket = pMotherBucket;
	m_it = m_mother_bucket->m_bucket_map->begin();
	m_end = m_mother_bucket->m_bucket_map->end();
}


/** The BucketConstIterator destructor.
 *
 */
BucketConstIterator::~BucketConstIterator()
{
	// We don't own the m_mother_bucket, so don't delete it.
}


/** Retrieve a boolean showing whether the iterator has hit the end
 * (false) or whether there are any feature values left (true).
 *
 * @return true if we have not yet hit the end, false if we have hit
 * the end.
 *
 */
bool BucketConstIterator::hasNext() const
{
	return m_it != m_end;
}


/** Get the current value, then advance the iterator.
 *
 * Note that hasNext() MUST return true, otherwise an EmdrosException
 * is thrown.
 *
 * @return a std::pair<std::string, const Bucket*> which gives, in the
 * pair's ".first" member the current feature, and in the pair's
 * ".second" member the current Bucket*.  This is before advancing the
 * iterator.
 */
std::pair<std::string, const Bucket*> BucketConstIterator::next()
{
	ASSERT_THROW(hasNext(), "Logic error: BucketConstIterator::next() called even though hasNext() returns false.");
	
	std::string feature = m_it->first;
	Bucket *pBucket = m_it->second;

	++m_it;

	return std::make_pair(feature, pBucket);
}


/** Get the current value of the iterator. Don't advance the iterator.
 *
 * Note that hasNext() MUST return true, otherwise an EmdrosException
 * is thrown.
 *
 * @return a std::pair<std::string, const Bucket*> which gives, in the
 * pair's ".first" member the current feature, and in the pair's
 * ".second" member the current Bucket*.
 */
std::pair<std::string, const Bucket*> BucketConstIterator::current() const
{
	ASSERT_THROW(hasNext(), "Logic error: BucketConstIterator::current() called even though hasNext() returns false.");
	
	std::string feature = m_it->first;
	Bucket *pBucket = m_it->second;

	return std::make_pair(feature, pBucket);
}



/////////////////////////////////////////////////////////////////
//
// MonadRange2BucketMap
//
/////////////////////////////////////////////////////////////////
/** The MonadRange2BucketMap constructor.  Nothing fancy to see
 * here. Move along.
 *
 */
MonadRange2BucketMap::MonadRange2BucketMap()
{
}

/** The MonadRange2BucketMap destructor.
 *
 * Deletes all Buckets created with MonadRange2BucketMap::getBucket().
 *
 */
MonadRange2BucketMap::~MonadRange2BucketMap()
{
	Monad2PBucketMap::iterator it = m_bucket_map.begin();
	while (it != m_bucket_map.end()) {
		Bucket *pBucket = it->second;
		delete pBucket;
		++it;
	}
	m_bucket_map.clear();
	m_monad_range_map.clear();
}

/** Add a monad range with a given name, thus creating a "bin".
 *
 * Note that all bins MUST be created before adding any Buckets with
 * MonadRange2BucketMap::getBucket().
 *
 * @param first_monad The first monad of the range.
 *
 * @param last_monad The last monad of the range. Note that last_monad
 * MUST be >= first_monad.
 *
 * @param name The name to assign to this bin.  For example, it could
 * be used to name the books or chapter numbers.

 */
void MonadRange2BucketMap::addRange(monad_m first_monad, monad_m last_monad, const std::string& name)
{
	m_bucket_map.insert(std::make_pair(first_monad, (Bucket*)0));
	m_monad_range_map.insert(std::make_pair(first_monad, last_monad));
	m_name_map.insert(std::make_pair(first_monad, name));
}


/** Get or create a Bucket associated with a given bin.
 *
 * The "monad" parameter determines which bin to use.  If this bin is
 * currently empty (no Bucket), then the Bucket is created using the
 * eBucketKind given in the "kind" parameter.
 *
 * Otherwise, if the bin already contains a Bucket, that bucket is
 * returned.
 *
 * Note that all bins MUST have been added with
 * MonadRange2BucketMap::addRange() before calling this method.
 *
 * @param monad The monad to use for binning.  This determines which
 * bin to use.
 *
 * @param kind The eBucketKind bucket kind to use if we are creating a
 * new Bucket (because the requested bin is empty).
 *
 * @return The Bucket (either newly created or just retrieved)
 * associated with the bin determined by the "monad" parameter.
 *
 */
Bucket *MonadRange2BucketMap::getBucket(monad_m monad, eBucketKind kind)
{
	ASSERT_THROW(!m_monad_range_map.empty(),
		     "Logic error: MonadRange2BucketMap::getBucket() called before calling addRange().");

	monad_m first_monad = findFirstMonad(monad);
	
	Monad2PBucketMap::iterator bucket_it = m_bucket_map.find(first_monad);
	if (bucket_it == m_bucket_map.end()) {
		// We went past the end
		Bucket *pNewBucket = new Bucket(kind);
		m_bucket_map.insert(std::make_pair(first_monad, pNewBucket));
		return pNewBucket;
	} else if (bucket_it->second == 0) {
		// First remove it, ...
		m_bucket_map.erase(bucket_it);

		// ... then add it.
		Bucket *pNewBucket = new Bucket(kind);
		m_bucket_map.insert(std::make_pair(first_monad, pNewBucket));
		
		return pNewBucket;
	} else {
		Bucket *pBucket = bucket_it->second;
		return pBucket;
	}
}

/** Find the name of a given bucket.
 *
 * The "monad" parameter determines which bin to use.  It need not be
 * the first_monad of the bin's range, but it must hold that
 * first_monad <= monad <= last_monad for the bin to be found.
 *
 * @param monad The monad by which to find the bin.
 *
 * @return The name of the bin, or empty if not found.
 *
 */
std::string MonadRange2BucketMap::findName(monad_m monad) const
{
	monad_m first_monad = findFirstMonad(monad);

	Monad2StringMap::const_iterator ci = m_name_map.find(first_monad);
	if (ci == m_name_map.end()) {
		return "";
	} else if (ci->first != first_monad) {
		return "";
	} else {
		return ci->second;
	}
}

/** Find the Bucket associated with a given bin.
 *
 * The "monad" parameter determines which bin to use.  It need not be
 * the first_monad of the bin's range, but it must hold that
 * first_monad <= monad <= last_monad for the bin to be found.
 *
 * @param monad The monad by which to find the bin.
 *
 * @return The Bucket associated with the bin, or nil (0) if not
 * found.  Note that 0 can also be returned if no Bucket has yet been
 * associated with the bin.
 *
 */
const Bucket *MonadRange2BucketMap::findConstBucket(monad_m monad) const
{
	monad_m first_monad = findFirstMonad(monad);

	Monad2PBucketMap::const_iterator ci = m_bucket_map.find(first_monad);
	if (ci == m_bucket_map.end()) {
		return 0;
	} else if (ci->first != first_monad) {
		return 0;
	} else {
		return ci->second;
	}
}

/** Find the first monad of a bin from a monad inside the bin's range.a
 *
 * The "monad" parameter determines which bin to use.  It need not be
 * the first_monad of the bin's range, but it must hold that
 * first_monad <= monad <= last_monad for the bin to be found.
 *
 * @param monad The monad by which to find the bin.
 *
 * @return The first monad of the bin's monad range.
 *
 */
monad_m MonadRange2BucketMap::findFirstMonad(monad_m monad) const
{
	Monad2MonadMap::const_iterator monad_ci = m_monad_range_map.lower_bound(monad);
	if (monad_ci == m_monad_range_map.end()) {
		return m_monad_range_map.rbegin()->first;
	} else {
		monad_m first_monad = monad_ci->first;
		while (first_monad > monad
		       && monad_ci != m_monad_range_map.begin()) {
			--monad_ci;
			first_monad = monad_ci->first;
		}
		if (first_monad > monad) {
			first_monad = m_monad_range_map.begin()->first;
		}
		return first_monad;
	}	
}

/** Retrieve a JSON representation of the MonadRange2BucketMap.
 *
 *
 * @return The JSON representation of the MonadRange2BucketMap and any
 * inner Buckets.
 *
 */
std::string MonadRange2BucketMap::getJSON() const
{
	Bigstring *pResult = new Bigstring();

	MonadRange2BucketMapConstIterator bin_ci(this);

	pResult->addChar('[');

	while (bin_ci.hasNext()) {
		std::pair<monad_m, monad_m> fm_lm = bin_ci.next();

		monad_m first_monad = fm_lm.first;
		monad_m last_monad = fm_lm.second;

		Monad2PBucketMap::const_iterator ci = m_bucket_map.find(first_monad);
		if (ci != m_bucket_map.end()) {
			const Bucket *pBucket = ci->second;

			if (pBucket != 0) {
				getBinJSONInBigstring(pResult, pBucket, first_monad, last_monad);

				bool bIsNonLast = bin_ci.hasNext();

				if (bIsNonLast) {
					pResult->addChar(',');
				}
			}
		}
	}

	pResult->addChar(']');

	std::string result;
	result = pResult->toString();

	delete pResult;
	
	return result;
}

/** Get the JSON representation of a given bin.
 *@internal
 *
 * This method is not meant to be called by the user.  Use the
 * MonadRange2BucketMap::getJSON() method instead.
 *
 * @param pResult The Bigstring into which to write the result.
 *
 * @param pBucket The Bucket associated with the given bin.
 *
 * @param first_monad The first monad of the bin's range.
 *
 * @param last_monad The last monad of the bin's range.
 *
 */
void MonadRange2BucketMap::getBinJSONInBigstring(Bigstring *pResult, const Bucket *pBucket, monad_m first_monad, monad_m last_monad) const
{
	// The buckets may not all be filled.
	if (pBucket != 0) {
		std::string tmpStr;
		// firstMonad
		ADD_STRING("{\"firstMonad\":");
		tmpStr = monad_m2string(first_monad);
		pResult->addCharsSimple(tmpStr.c_str(), tmpStr.length());
		
		// lastMonad
		ADD_STRING(",\"lastMonad\":");
		tmpStr = monad_m2string(last_monad);
		pResult->addCharsSimple(tmpStr.c_str(), tmpStr.length());
		
		// binFeatureValue
		ADD_STRING(",\"binFeatureValue\":\"");
		tmpStr = encodeSTRINGstring(m_name_map.find(first_monad)->second); // FIXME: Do JSON escaping, not MQL escaping!
		pResult->addCharsSimple(tmpStr.c_str(), tmpStr.length());
		ADD_STRING("\",\"bucket\":");
		
		// The bucket itself
		pBucket->getJSONInBigstring(pResult);
		
		// Closing '}'
		pResult->addChar('}');
	}
}

/**
 * Utility function to pretty print a MonadRange2BucketMap, including
 * any inner Buckets.
 *
 * @param out The std::ostream to which to pretty print the Bucket.
 *
 * @param indent The level of indentation to use for this Bucket.
 * Should probably be 0 when calling from the outside.
 *
 */
void MonadRange2BucketMap::prettyPrint(std::ostream& out, int indent) const
{
	MonadRange2BucketMapConstIterator ci = MonadRange2BucketMapConstIterator(this);
	while (ci.hasNext()) {
		std::pair<monad_m, monad_m> fm_lm = ci.next();
		
		local_print_indent(out, indent);

		std::string name = findName(fm_lm.first);
	
		out << "MonadRange({" << fm_lm.first << "-" << fm_lm.second << "}, name = \"" << name << "\") : [\n";
		local_print_indent(out, indent+1);

		const Bucket *pBucket = findConstBucket(fm_lm.first);
		if (pBucket != 0) {
			pBucket->prettyPrint(out, indent+1);
			out << "\n";
		}

		local_print_indent(out, indent);

		out << "]\n\n";
	}
}

/////////////////////////////////////////////////////////////////
//
// MonadRange2BucketMapConstIterator
//
/////////////////////////////////////////////////////////////////
/** The MonadRange2BucketMapConstIterator constructor.
 *
 * Call this with a pointer to the MonadRange2BucketMap over which you
 * want to iterate.
 * 
 * @param mother_bucket_map The MonadRang2BucketMap over which we want
 * to iterate.
 *
 */
MonadRange2BucketMapConstIterator::MonadRange2BucketMapConstIterator(const MonadRange2BucketMap *mother_bucket_map)
{
	m_mother_bucket_map = mother_bucket_map;

	m_it = m_mother_bucket_map->m_monad_range_map.begin();
	m_end = m_mother_bucket_map->m_monad_range_map.end();
}


/** The MonadRange2BucketMapConstIterator destructor. Doesn't destroy
 * anything but itself.
 *
 */
MonadRange2BucketMapConstIterator::~MonadRange2BucketMapConstIterator()
{
	// Nothing to do.
}


/** Retrieve a boolean showing whether the iterator has hit the end
 * (false) or whether there are any feature values left (true).
 *
 * @return true if we have not yet hit the end, false if we have hit
 * the end.
 *
 */
bool MonadRange2BucketMapConstIterator::hasNext() const
{
	return m_it != m_end;
}


/** Get the current value, then advance the iterator.
 *
 * Note that hasNext() MUST return true, otherwise an EmdrosException
 * is thrown.
 *
 * The iterator returns a std::pair detailing the first and last
 * monads of the bin.  Then you can use any of the folowing to
 * retrieve what you want:
 *
 * a) MonadRange2BucketMap::findConstBucket();
 *
 * b) MonadRange2BucketMap::findName();
 *
 * @return a std::pair<monad_m, monad_m> which gives, in the pair's
 * ".first" member the current bin's first monad, and in the pair's
 * ".second" member the current bin's last_monad.  This is before
 * advancing the iterator.
 */
std::pair<monad_m, monad_m> MonadRange2BucketMapConstIterator::next()
{
	ASSERT_THROW(hasNext(),
		     "Logic error: MonadRange2BucketMapConstIterator::next() called even though hasNext() returns false");
	monad_m first_monad = m_it->first;
	monad_m last_monad = m_it->second;

	++m_it;

	return std::make_pair(first_monad, last_monad);
}


/** Get the current value.  Don't advance the iterator.
 *
 * Note that hasNext() MUST return true, otherwise an EmdrosException
 * is thrown.
 *
 * The iterator returns a std::pair detailing the first and last
 * monads of the bin.  Then you can use any of the folowing to
 * retrieve what you want:
 *
 * a) MonadRange2BucketMap::findConstBucket();
 *
 * b) MonadRange2BucketMap::findName();
 *
 * @return a std::pair<monad_m, monad_m> which gives, in the pair's
 * ".first" member the current bin's first monad, and in the pair's
 * ".second" member the current bin's last_monad.
 */
std::pair<monad_m, monad_m> MonadRange2BucketMapConstIterator::current() const
{
	ASSERT_THROW(hasNext(),
		     "Logic error: MonadRange2BucketMapConstIterator::current() called even though hasNext() returns false");
	monad_m first_monad = m_it->first;
	monad_m last_monad = m_it->second;

	return std::make_pair(first_monad, last_monad);
}





typedef std::list<std::string> FeatureList;

/** An internal function used to count with Buckets in a Sheaf.
 *@internal
 *
 * @param pSheaf The Sheaf to traverse.
 *
 * @param feature_list A list of the features retrieved, in the order
 * retrieved.
 *
 * @param pBucketMap The BucketMap from which to get the Buckets,
 * binned by the innermost MatchedObject's first monad.
 *
 *
 */
void local_countInSheaf(const Sheaf *pSheaf, const FeatureList& feature_list, MonadRange2BucketMap *pBucketMap)
{
	SheafConstIterator sheafCI = pSheaf->const_iterator();
	while (sheafCI.hasNext()) {
		const Straw *pStraw = sheafCI.next();
		StrawConstIterator strawCI = pStraw->const_iterator();
		while (strawCI.hasNext()) {
			const MatchedObject *pMO = strawCI.next();

			FeatureList inner_feature_list = feature_list;
			int number_of_features = pMO->getNoOfEMdFValues();
			if (number_of_features == 0) {
				inner_feature_list.push_back("");
			} else {
				int feature_index = 0;
				while (feature_index < number_of_features) {
					std::string feature = pMO->getFeatureAsString(feature_index);
					inner_feature_list.push_back(feature);
					++feature_index;
				}
			}

			if (pMO->sheafIsEmpty()) {
				monad_m first_monad = pMO->getFirst();
				Bucket *pBucket =
					pBucketMap->getBucket(first_monad, kBKBucket);

				FeatureList::const_iterator feature_ci = inner_feature_list.begin();
				while (feature_ci != inner_feature_list.end()) {
					std::string feature = *feature_ci;
					++feature_ci;
					
					bool bIsLast = feature_ci == inner_feature_list.end();
					pBucket = pBucket->getBucket(feature, (bIsLast) ? kBKCount : kBKBucket);
				}
				ASSERT_THROW(pBucket->getKind() == kBKCount,
					     "Logic error: pBucket->getKind() != kBKCount. Please fix this bug.");
				pBucket->incrementCount();
			} else {
				local_countInSheaf(pMO->getSheaf(), inner_feature_list, pBucketMap);
			}
		}
	}
}
       
/** Create binned buckets from a Sheaf and a MonadRange2BucketMap.
 *
 * The pBucketMap will own the Buckets, because it creates them.
 *
 * Note that the pBucketMap MUST have had any monad ranges added to it
 * using MonadRange2BucketMap::addRange() BEFORE calling this
 * function.
 *
 * @param pSheaf The Sheaf to traverse and count.
 *
 * @param pBucketMap The MonadRange2BucketMap to use for binning.
 *
 */
void countInSheaf(const Sheaf *pSheaf, MonadRange2BucketMap *pBucketMap)
{
	FeatureList feature_list; // Empty feature list

	local_countInSheaf(pSheaf, feature_list, pBucketMap);
}


/** Create a MonadRange2BucketMap from a Sheaf.
 *
 * If pSheaf is 0, failed, or empty, then a MonadRange2BucketMap is
 * returned which has just one bin: The one encompassing all possible
 * monads (from 1 to MAX_MONAD).  This bin will have the name "".
 *
 * Otherwise, the sheaf is traversed, and the outermost Sheaf's
 * MatchedObjects are added as bins to the MonadRange2BucketMap
 * created.
 *
 * If the sheaf has non-empty inner sheaves, they are ignored.
 *
 * For example, this query will make bins from all Books, and name
 * each bin by the book's DJHRef (3-letter abbreviation).
 *
 * SELECT ALL OBJECTS WHERE [Book GET DJHRef]GO
 *
 * This query, on the other hand, will create bins for all chapters in
 * Genesis, naming each bin by the chapter number:
 * 
 * SELECT ALL OBJECTS WHERE [Chapter GET chapter]GO
 *
 * @param pSheaf The Sheaf to traverse, or 0 if you want a one-bin
 * MonadRange2BucketMap which encompasses all possible monads.
 *
 * @param A MonadRange2BucketMap as explained above.
 */
MonadRange2BucketMap *makeBucketMapFromSheaf(const Sheaf *pSheaf)
{
	MonadRange2BucketMap *pResult = new MonadRange2BucketMap();
	if (pSheaf == 0
	    || pSheaf->isFail()) {
		pResult->addRange(1, MAX_MONAD, "");
		return pResult;
	} else {
		bool bDidAtLeastOne = false;
		SheafConstIterator sheafCI = pSheaf->const_iterator();
		while (sheafCI.hasNext()) {
			const Straw *pStraw = sheafCI.next();
			StrawConstIterator strawCI = pStraw->const_iterator();
			while (strawCI.hasNext()) {
				const MatchedObject *pMO = strawCI.next();
				std::string name;
				if (pMO->getNoOfEMdFValues() != 0) {
					name = pMO->getFeatureAsString(0);
				} else {
					// name = ""; // Nothing to do.
				}
				monad_m first_monad = pMO->getFirst();
				monad_m last_monad = pMO->getLast();

				pResult->addRange(first_monad, last_monad, name);
				bDidAtLeastOne = true;
			}
		}
		if (!bDidAtLeastOne) {
			pResult->addRange(1, MAX_MONAD, "");
		}
		return pResult;
	}
}

/** Make a bucket map by constructing a query, executing it, and
 * calling makeBucketMapFromSheaf().
 *
 * If the query doesn't work, makeBucketMapFromSheaf() is called with
 * a nil (0) parameter, meaning the MonadRange2BucketMap is one large
 * bin containing all possible monads.
 *
 * @param pEE The EmdrosEnv connected to the database which we want to query.
 *
 * @param bin_otn The object type name to use for the bins.  If empty,
 * then makeBucketMapFromSheaf() is called with a nil (0) parameter.
 *
 * @param bin_feature_name The feature name on the bin object type to
 * use for naming each bin.  Or empty if you don't want to name the
 * bins anything other than the empty string.
 *
 * @param in_som The SetOfMonads to use as the containing monads.  Can
 * be, for example, the range of monads of a Book.  If empty, it is
 * assumed that all monads in the entire database are intended.
 *
 * @param bResult Upon success, will be true. Upon failure, will be
 * false.
 *
 * @return The MonadRange2BucketMap created from the parameters given.
 *
 */
MonadRange2BucketMap *getBucketMapFromParams(EmdrosEnv *pEE, const std::string& bin_otn, const std::string& bin_feature_name, const SetOfMonads& in_som, bool& bResult)
{
	if (bin_otn.empty()) {
		bResult = true;
		MonadRange2BucketMap *pResult = makeBucketMapFromSheaf(0);

		return pResult;
	} else {
		std::string query = "SELECT ALL OBJECTS ";
		if (!in_som.isEmpty()) {
			query += "IN" + in_som.toString();
		}
		query += "WHERE [" + bin_otn;
		if (bin_feature_name.empty()) {
			query += "]GO";
		} else {
			query += " GET " + bin_feature_name + "]GO";
		}
		
		bResult = false;
		bool bPrintOutput = false;
		MQLResultCallback *pCallback = 0;
		if (!pEE->executeString(query, bResult, bPrintOutput, true, pCallback)) {
			// std::cerr << "FAILURE: Database error executing " << query << std::endl;
			bResult = false;
			return 0;
		} else {
			if (!bResult) {
				// std::cerr << "FAILURE: Compiler error executing " << query << std::endl;
				bResult = false;
				return 0;
			} else { 
				bResult = true;
				Sheaf *pBinSheaf = pEE->takeOverSheaf();
				
				MonadRange2BucketMap *pResult = makeBucketMapFromSheaf(pBinSheaf);
				
				delete pBinSheaf;
				
				return pResult;
			}
		}
	}
}


/* Make sure we can do an amalgamation with more than one #define for ADD_STRING. */
#undef ADD_STRING
