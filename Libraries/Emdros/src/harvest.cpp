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
