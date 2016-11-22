/*
 * harvest.cpp - functions for harvesting
 *
 * Copyright (C) 2016 SourceView LLC. All rights reserved.
 *
 * Created: 2016/04/01
 * Last update: 2016/08/02
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


bool getWordCountsInSOM(EmdrosEnv *pEE, const SetOfMonads& substrate, const std::set<std::string>& stop_word_set, String2IntMap& result, std::string& error_message)
{
	std::string query = "SELECT ALL OBJECTS IN " + substrate.toString() + "WHERE [Token GET surface_fts]";

	bool bCompileResult = false;
	bool bDBResult = pEE->executeString(query, bCompileResult, false, false, 0);
	bool bResult = bDBResult && bCompileResult;
	if (!bResult) {
		error_message += "DBError: " + pEE->getDBError() + "\nCompilerError: " + pEE->getCompilerError() + "\n";
		return false;
	} else {
		TokenBucket *pBucket = new TokenBucket(stop_word_set);

		Sheaf *pSheaf = pEE->takeOverSheaf();
		pBucket->countInSheaf(pSheaf);
		delete pSheaf;

		// std::string result = pBucket->getJSON();
		result = pBucket->m_token_count_map;
		delete pBucket;
		return true;
	}
}




/////////////////////////////////////////////////////////////////
//
// WordCount: counts of words and sphere tokens
//
/////////////////////////////////////////////////////////////////
WordCounts::WordCounts()
	: m_word_count(0),
	  m_Family(0),
	  m_Economics(0),
	  m_Government(0),
	  m_Religion(0),
	  m_Education(0),
	  m_MediaCom(0),
	  m_Celebration(0)
{
}


WordCounts::WordCounts(const WordCounts& other)
{
	assign(other);
}


WordCounts::~WordCounts()
{
}


WordCounts& WordCounts::operator=(const WordCounts& other)
{
	assign(other);
	return *this;
}

void WordCounts::assign(const WordCounts& other)
{
	m_word_count = other.m_word_count;
	m_Family = other.m_Family;
	m_Economics = other.m_Economics;
	m_Government = other.m_Government;
	m_Religion = other.m_Religion;
	m_Education = other.m_Education;
	m_MediaCom = other.m_MediaCom;
	m_Celebration = other.m_Celebration;
}




/**
 * Count token counts and sphere counts of tokens within a context
 * object type (such as Statement), and optionally within a context
 * substrate (i.e., context set of monads).
 *
 * Optionally, limit the Token by a feature value restriction.
 *
 * @param pEE The EmdrosEnv to search
 *
 * @param substrate A set of monads within which to search.  The set
 * of monads, if non-empty, must encompass all of the
 * context_object_type objects being searched.  If empty, all of the
 * database is searched.
 *
 * @param context_object_type The outer context object type inside of
 * which the tokens must be found.
 *
 * @param context_feature_comparison If empty, no restriction is put
 * on the context object type.  If non-empty, it is placed right in
 * the MQL, unmodified, at the point where the context object type
 * gets its feature restrictions.
 *
 * @param token_feature_comparison If empty, no restriction is put on
 * the Tokens inside.  If non-empty, then it is placed straight into
 * the MQL query at the spot where the Token gets its feature
 * restrictions.  This means, any string value must be surrounded by
 * double quotes, and escaped with the escapeSTRINGstring() function
 * which is part of Emdros.  For example: "Family=true" or
 * "surface_fts=\"" + escapeSTRINGstring(peace) + "\"".
 *
 *
 *
 *
 *
 * @return true upon success, false upon error.
 */
bool getWordCountsInContext(EmdrosEnv *pEE,
			    const SetOfMonads& substrate,
			    const std::string& context_object_type,
			    const std::string& context_feature_comparison,
			    const std::string& token_feature_comparison,
			    ID_D2WordCountsMap& result,
			    std::string& error_message)
{
	std::string query = "SELECT ALL OBJECTS";
	if (!substrate.isEmpty()) {
		query += " IN " + substrate.toString();
	}
	query += "WHERE [" + context_object_type;
	if (!context_feature_comparison.empty()) {
		query += " " + context_feature_comparison;
	}

	query += "[Token";
	if (!token_feature_comparison.empty()) {
		query += " " + token_feature_comparison;
	}
	query += " GET Family, Economics, Government, Religion, Education, MediaCom, Celebration";
	query += "]]";

	// std::cerr << "UP200: query = " << query << std::endl;

	bool bCompileResult = false;
	bool bDBResult = pEE->executeString(query, bCompileResult, false, false, 0);
	bool bResult = bDBResult && bCompileResult;
	if (!bResult) {
		error_message += "DBError: " + pEE->getDBError() + "\nCompilerError: " + pEE->getCompilerError() + "\n";
		return false;
	} else {
		Sheaf *pSheaf = pEE->takeOverSheaf();

		SheafConstIterator context_sheaf_ci = pSheaf->const_iterator();
		while (context_sheaf_ci.hasNext()) {
			const Straw *pStraw = context_sheaf_ci.next();
			StrawConstIterator context_straw_ci = pStraw->const_iterator();
			while (context_straw_ci.hasNext()) {
				const MatchedObject *pContextMO = context_straw_ci.next();

				id_d_t context_id_d = pContextMO->getID_D();


				WordCounts wc;

				SheafConstIterator token_sheaf_ci = pContextMO->getSheaf()->const_iterator();
				while (token_sheaf_ci.hasNext()) {
					const Straw *pStraw = token_sheaf_ci.next();
					StrawConstIterator token_straw_ci = pStraw->const_iterator();
					while (token_straw_ci.hasNext()) {
						const MatchedObject *pTokenMO = token_straw_ci.next();
						++wc.m_word_count;


						if (pTokenMO->getFeatureAsString(0) != "false") {
							++wc.m_Family;
						}

						if (pTokenMO->getFeatureAsString(1) != "false") {
							++wc.m_Economics;
						}

						if (pTokenMO->getFeatureAsString(2) != "false") {
							++wc.m_Government;
						}

						if (pTokenMO->getFeatureAsString(3) != "false") {
							++wc.m_Religion;
						}

						if (pTokenMO->getFeatureAsString(4) != "false") {
							++wc.m_Education;
						}

						if (pTokenMO->getFeatureAsString(5) != "false") {
							++wc.m_MediaCom;
						}

						if (pTokenMO->getFeatureAsString(6) != "false") {
							++wc.m_Celebration;
						}
					}
				}

				// std::cerr << "UP204: wc.m_word_count = " << wc.m_word_count << "\n";
				result.insert(std::make_pair(context_id_d, wc));
			}
		}

		delete pSheaf;

		return true;
	}
}


/////////////////////////////////////////////////////////////////
//
// WordOccurrence: Occurrences of words
//
/////////////////////////////////////////////////////////////////
WordOccurrence::WordOccurrence()
: m_id(0),
m_DJHRef(),
m_chapter(0),
m_verse(0),
m_source_name(),
m_role(0),
m_source_occurrence(0),
m_monad(0),
m_first_monad(0),
m_last_monad(0)
{
}


WordOccurrence::WordOccurrence(const WordOccurrence& other)
{
    assign(other);
}


WordOccurrence::~WordOccurrence()
{
}


WordOccurrence& WordOccurrence::operator=(const WordOccurrence& other)
{
    assign(other);
    return *this;
}

bool WordOccurrence::operator<(const WordOccurrence& rhs) const
{
    return m_monad < rhs.m_monad;
}

void WordOccurrence::assign(const WordOccurrence& other)
{
    m_DJHRef = other.m_DJHRef;
    m_chapter = other.m_chapter;
    m_verse = other.m_verse;
    m_source_name = other.m_source_name;
    m_role = other.m_role;
    m_source_occurrence = other.m_source_occurrence;
    m_monad = other.m_monad;
    m_first_monad = other.m_first_monad;
    m_last_monad = other.m_last_monad;
}



bool getWordOccurrencesForQuery(EmdrosEnv *pEE,
                                const std::string& query,
                                WordOccurrenceSet& result,
                                std::string& error_message)
{
    bool bCompileResult = false;
    bool bDBResult = pEE->executeString(query, bCompileResult, false, false, 0);
    bool bResult = bDBResult && bCompileResult;
    if (!bResult) {
        error_message += "DBError: " + pEE->getDBError() + "\nCompilerError: " + pEE->getCompilerError() + "\n";
        return false;
    } else {
        Sheaf *pSheaf = pEE->takeOverSheaf();
        

        SheafConstIterator context_sheaf_ci = pSheaf->const_iterator();
        while (context_sheaf_ci.hasNext()) {
            
            // Loop through all the context objects
            const Straw *pStraw = context_sheaf_ci.next();
            StrawConstIterator context_straw_ci = pStraw->const_iterator();
            while (context_straw_ci.hasNext()) {
                const MatchedObject *pContextMO = context_straw_ci.next();
                
                
                // Loop through all the source sheafs
                SheafConstIterator source_sheaf_ci = pContextMO->getSheaf()->const_iterator();
                while (source_sheaf_ci.hasNext()) {
                    
                    // Loop through all the source straws
                    const Straw *pStraw = source_sheaf_ci.next();
                    StrawConstIterator source_straw_ci = pStraw->const_iterator();
                    while (source_straw_ci.hasNext()) {
                        const MatchedObject *pSourceMO = source_straw_ci.next();
                        
                        const int role = (int)pSourceMO->getFeatureAsLong(0);
                        const std::string source_name = pSourceMO->getFeatureAsString(1);
                        const int source_occurrence = (int)pSourceMO->getFeatureAsLong(2);
                        
                        // Loop through all the verse sheafs
                        SheafConstIterator verse_sheaf_ci = pSourceMO->getSheaf()->const_iterator();
                        while (verse_sheaf_ci.hasNext()) {
                            
                            // Loop through all the verse straws
                            const Straw *pStraw = verse_sheaf_ci.next();
                            StrawConstIterator verse_straw_ci = pStraw->const_iterator();
                            while (verse_straw_ci.hasNext()) {
                                const MatchedObject *pVerseMO = verse_straw_ci.next();
                                
                                const std::string djhref = pVerseMO->getFeatureAsString(0);
                                const int chapter = (int)pVerseMO->getFeatureAsLong(1);
                                const int verse = (int)pVerseMO->getFeatureAsLong(2);
                                const SetOfMonads monads = pVerseMO->getMonads();
                                
                                // Loop through all the token sheafs
                                SheafConstIterator token_sheaf_ci = pVerseMO->getSheaf()->const_iterator();
                                while (token_sheaf_ci.hasNext()) {
                                    
                                    // Loop through all the token straws
                                    const Straw *pStraw = token_sheaf_ci.next();
                                    StrawConstIterator token_straw_ci = pStraw->const_iterator();
                                    while (token_straw_ci.hasNext()) {
                                        const MatchedObject *pTokenMO = token_straw_ci.next();
                                        monad_m monad = pTokenMO->getMonads().first();
                                        
                                        WordOccurrence word_occurrence;
                                        word_occurrence.m_id = monad;
                                        word_occurrence.m_DJHRef = djhref;
                                        word_occurrence.m_chapter = chapter;
                                        word_occurrence.m_verse = verse;
                                        word_occurrence.m_role = role;
                                        word_occurrence.m_source_name = source_name;
                                        word_occurrence.m_source_occurrence = source_occurrence;
                                        word_occurrence.m_monad = monad;
                                        word_occurrence.m_first_monad = monads.first();
                                        word_occurrence.m_last_monad = monads.last();
                                        
                                        result.insert(word_occurrence);
                                                                            }
                                }
                            }
                        }
                        
                    }
                }
                
            }
        }
        
        delete pSheaf;
        
        return true;
    }
}
