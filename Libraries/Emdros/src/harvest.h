/*
 * harvest.h - functions for harvesting
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

#ifndef HARVEST_H_
#define HARVEST_H_

#include <map>
#include <string>

#include "emdros.h"

bool getMonadsForBook(EmdrosEnv *pEE, const std::string& book, monad_m& first_monad, monad_m& last_monad);

bool getSOMForQuery(EmdrosEnv *pEE, const std::string& query, bool bUseOnlyFocusObjects, SetOfMonads& som);

std::string countInBuckets(EmdrosEnv *pEE, const std::string& json_string, const SetOfMonads& substrate, std::string& error_message);


std::string getWordCountsInSOM(EmdrosEnv *pEE, const SetOfMonads& substrate, const std::set<std::string>& stop_word_set, std::string& error_message);



class WordCounts {
 public:
	int m_word_count;
	int m_Family;
	int m_Economics;
	int m_Government;
	int m_Religion;
	int m_Education;
	int m_MediaCom;
	int m_Celebration;
 public:
	WordCounts();
	WordCounts(const WordCounts& other);
	~WordCounts();

	WordCounts& operator=(const WordCounts& other);
 protected:
	void assign(const WordCounts& other);
};

typedef std::map<id_d_t, WordCounts> ID_D2WordCountsMap;

extern bool getWordCountsInContext(EmdrosEnv *pEE, const SetOfMonads& substrate, const std::string& context_object_type, const std::string& feature_to_compare, const std::string& feature_value, bool feature_is_string, ID_D2WordCountsMap& result, std::string& error_message);

#endif /* !defined(HARVEST_H_) */
