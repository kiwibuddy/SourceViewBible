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


typedef std::map<std::string, int> String2IntMap;
bool getWordCountsInSOM(EmdrosEnv *pEE, const SetOfMonads& substrate, const std::set<std::string>& stop_word_set, String2IntMap& result, std::string& error_message);



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

extern bool getWordCountsInContext(EmdrosEnv *pEE,
				   const SetOfMonads& substrate,
				   const std::string& context_object_type,
				   const std::string& context_feature_comparison,				   const std::string& token_feature_comparison,
				   ID_D2WordCountsMap& result,
				   std::string& error_message);


class WordOccurrence {
public:
    std::string m_DJHRef;
    int m_chapter;
    int m_verse;
    std::string m_source_name;
    std::string m_source_color;
    int m_source_occurrence;
    monad_m m_monad;
public:
    WordOccurrence();
    WordOccurrence(const WordOccurrence& other);
    ~WordOccurrence();
    
    WordOccurrence& operator=(const WordOccurrence& other);
    bool operator<(const WordOccurrence& rhs) const;
protected:
    void assign(const WordOccurrence& other);
};

typedef std::set<WordOccurrence> WordOccurrenceSet;
extern bool getWordOccurrencesForQuery(EmdrosEnv *pEE,
                                       const std::string& query,
                                       WordOccurrenceSet& result,
                                       std::string& error_message);

#endif /* !defined(HARVEST_H_) */
