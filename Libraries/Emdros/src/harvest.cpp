/*
 * harvest.cpp - functions for harvesting
 *
 * Copyright (C) 2016 SourceView LLC. All rights reserved.
 *
 * Created: 2016/04/01
 * Last update: 2016/04/02
 *
 * Contributors:
 *
 * Ulrik Sandborg-Petersen
 * Jonathan Younger
 *
 */

/*
 * The purpose of this module is to facilitate querying the Emdros databases.
 *
 */

#ifndef HARVEST_H_
#include "harvest.h"
#endif

#ifndef BUCKET_H_
#include "bucket.h"
#endif

#include "emdros.h"

/** Get a SetOfMonads which is the big-union of all sets of monads in
 * the sheaf arising from a given query.
 *
 * If bUseOnlyFocusObjects is true, then only those MatchedObjects in
 * the sheaf which arise from an object block with the FOCUS keyword
 * are added to the big-union monad set.
 * 
 * @param pEE The EmdrosEnv connected to the database which we want to query.
 *
 * @param query The query which we want to execute against the
 * database.  Currently, only SELECT ALL OBJECTS queries are
 * supported.
 *
 * @param bUseOnlyFocusObjects Set this to true in order to use only
 * those MatchedObjects which have the FOCUS boolean set.
 *
 * @param The output SetOfMonads.
 *
 * @return true upon success, false upon failure.
 *
 */
bool getSOMForQuery(EmdrosEnv *pEE, const std::string& query, bool bUseOnlyFocusObjects, SetOfMonads& som)
{
	bool bCompileResult = false;
	bool bDBResult = pEE->executeString(query, bCompileResult, false, false, 0);
	if (bDBResult && bCompileResult) {
		if (pEE->isSheaf()) {
			Sheaf *pSheaf = pEE->takeOverSheaf();
			pSheaf->getSOM(som, bUseOnlyFocusObjects);
			delete pSheaf;
			return true;
		} else if (pEE->isFlatSheaf()) {
			// Don't currently know how to do flat sheaves.
			return false;
		} else {
			// Don't currently know how to do tables.
			return false;
		}
	} else {
		som = SetOfMonads(); // Empty set.
		return false;
	}
}
       
/** Retrieve the first and last monads of a given book.
 *
 * The book name passed in must be the three-letter abbreviation used
 * by David Joel Hamilton, hence the DJHRef for DJH Reference.
 *
 * @param pEE The EmdrosEnv connected to the database which we want to query.
 *
 * @param book The 3-letter DJH Reference book abbreviation.
 *
 * @param first_monad Upon success, will be set to the first monad of
 * the given book.
 *
 * @param last_monad Upon success, will be set to the last monad of
 * the given book.
 *
 * @return true upon success, false upon failure.
 *
 */
bool getMonadsForBook(EmdrosEnv *pEE, const std::string& book, monad_m& first_monad, monad_m& last_monad)
{
	std::string query = "SELECT ALL OBJECTS WHERE [Book DJHRef='" + book + "']";
	SetOfMonads som;
	bool bResult = getSOMForQuery(pEE, query, false, som);
	if (bResult
	    && !som.isEmpty()) {
		first_monad = som.first();
		last_monad = som.last();
		return true;
	}
	return false;
}

/** Return a string containing a JSON encoding of the Bucket arising
 * from running the given bucket specification on the given EmdrosEnv.
 *
 * Upon error, the returned JSON string is simply the empty, object,
 * "{}".
 *
 * @param pEE A valid EmdrosEnv being an open connection to the
 * database which the caller wishes to search.
 *
 * @param bucket_specification_json_string A string giving the JSON
 * serialization of the bucket specification JSON object.
 *
 * @param substrate A SetOfMonads giving the monads within which to
 * search.  If this is empty, then all monads are searched at the top
 * level.
 *
 * @param error_message An output string that contains any error
 * message (for developer consumption only -- not to be passed on to
 * the user).
 *
 * @return On error, the string "{}".  On success, a JSON
 * representation of the Bucket resulting from running the bucket
 * specification on the given substrate using the pEE Emdros
 * connection.
 *
 */
std::string countInBuckets(EmdrosEnv *pEE, const std::string& bucket_specification_json_string, const SetOfMonads& substrate, std::string& error_message)
{
	Bucket *pBucket = getBucketFromJSONBucketSpecification(pEE, bucket_specification_json_string, substrate, error_message);
	if (pBucket == 0) {
		return "{}";
	} else {
		std::string result = pBucket->getJSON();
		delete pBucket;
		return result;
	}
}
