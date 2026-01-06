/*
 * bucket.cpp - Buckets for counting.
 *
 * Copyright (C) 2016 SourceView LLC. All rights reserved.
 *
 * Created: 2016/03/31
 * Last update: 2016/08/02
 *
 * Contributors:
 *
 * Ulrik Sandborg-Petersen
 * Jonathan Younger
 *
 */

#include "bucket.h"

#include <list>



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



/////////////////////////////////////////////////////////////////
//
// BucketValue
//
/////////////////////////////////////////////////////////////////
BucketValue::BucketValue(const std::string& object_type_name,
			 const std::string& feature_name,
			 const std::string& feature_value,
			 monad_m first_monad,
			 monad_m last_monad,
			 eBucketKind bucket_kind)
	:
	m_object_type_name(object_type_name),
	m_feature_name(feature_name),
	m_feature_value(feature_value),
	m_first_monad(first_monad),
	m_last_monad(last_monad),
	m_bucket_kind(bucket_kind)
{
}

BucketValue::BucketValue(const BucketValue& other)
	: 
	m_object_type_name(other.m_object_type_name),
	m_feature_name(other.m_feature_name),
	m_feature_value(other.m_feature_value),
	m_first_monad(other.m_first_monad),
	m_last_monad(other.m_last_monad),
	m_bucket_kind(other.m_bucket_kind)
{
}


BucketValue::~BucketValue()
{
}






/////////////////////////////////////////////////////////////////
//
// BucketSpecification
//
/////////////////////////////////////////////////////////////////
typedef enum {
	kBCOAddMyOwn,
	kBCOAddRecursively
} eBucketCountOperation;

class BucketSpecification {
protected:
	std::string m_object_type_name;
	std::list<std::string> m_feature_name_list;
	std::string m_expression;
	std::string m_bucket_kind_override;
	Sheaf *m_pSheaf;
	BucketSpecification *m_inner_bucket_specification;
public:
	BucketSpecification(const std::string& object_type_name,
			    const std::list<std::string> feature_name_list,
			    const std::string& expression,
			    const std::string& bucket_kind_override);
	~BucketSpecification();

	bool getOTNIsBin() const;

	bool weed(std::string& error_message) const;

	bool execute(EmdrosEnv *pEnv, const SetOfMonads& substrate, std::string& error_message);

	void setInnerBucketSpecification(BucketSpecification *inner_bucket_specification);

	static Bucket *makeBucket(BucketSpecification *pBucketSpecification);

	void prettyPrint(std::ostream& ostr, int indent = 0);
	
protected:
	void makeBucketStructure(Bucket *pTopLevelBucket, int depth);
	
	std::string getQuery(const SetOfMonads& substrate) const;

	eBucketKind getBucketKind() const;

	eBucketKind getChildBucketKind(std::string& child_object_type_name) const;

	BucketSpecification *getInnerBucketSpecification();

	void clean();
};


BucketSpecification::BucketSpecification(const std::string& object_type_name,
					 const std::list<std::string> feature_name_list,
					 const std::string& expression,
					 const std::string& bucket_kind_override)
	: m_object_type_name(object_type_name),
	  m_feature_name_list(feature_name_list),
	  m_expression(expression),
	  m_bucket_kind_override(bucket_kind_override),
	  m_pSheaf(0),
	  m_inner_bucket_specification(0)
{
}


BucketSpecification::~BucketSpecification()
{
	clean();
	delete m_inner_bucket_specification;
}



bool BucketSpecification::getOTNIsBin() const
{
	if (m_bucket_kind_override.empty()) {
		return false;
	} else if (m_bucket_kind_override == "count") {
		return false;
	} else if (m_bucket_kind_override == "bucket") {
		return false;
	} else if (m_bucket_kind_override == "bin") {
		return true;
	} else {
		ASSERT_THROW(false,
			     "ERROR: BucketSpecification::m_bucket_kind_override = '" + m_bucket_kind_override + "', which is unknown. We should have caught this in BucketSpecification::weed().\n");
		return false;
	}
}



std::string BucketSpecification::getQuery(const SetOfMonads& substrate) const
{
	std::string query = "SELECT ALL OBJECTS ";
	if (!substrate.isEmpty()) {
		query += "IN" + substrate.toString();
	}
	query += "WHERE\n[" + m_object_type_name;
	if (!m_expression.empty()) {
		query += " " + m_expression;
	}
	if (!m_feature_name_list.empty()) {
		query += " GET " + joinList(",", m_feature_name_list);
	}
	query += "]\nGO";
	return query;
}

bool BucketSpecification::weed(std::string& error_message) const
{
	bool bResult = true;
	if (m_inner_bucket_specification != 0) {
		bResult = m_inner_bucket_specification->weed(error_message);
	}
	if (!bResult) {
		return false;
	}
	
	if (m_bucket_kind_override.empty()) {
		bResult = true;
	} else if (m_bucket_kind_override == "count") {
		bResult = m_inner_bucket_specification == 0;
		if (!bResult) {
			error_message += "ERROR: objectTypeName '" + m_object_type_name + "' has a 'bucket_kind' value of 'count', yet this is not the innermost bucket specification. The 'count' bucket kind can only be specified on the innermost bucket specification.\n";
		}
	} else if (m_bucket_kind_override == "bin"
		   || m_bucket_kind_override == "bucket") {
		bResult = m_inner_bucket_specification != 0;
		if (!bResult) {
			error_message += "ERROR: objectTypeName '" + m_object_type_name + "' has a 'bucket_kind' value of '" + m_bucket_kind_override + "', yet this is the innermost bucket specification. The '" + m_bucket_kind_override + "' bucket kind can only be specified on non-innermost bucket specifications.\n";
		}
	} else {
		bResult = false;
		error_message += "ERROR: objectTypeName '" + m_object_type_name + "' has a 'bucket_kind' value of '" + m_bucket_kind_override + "', but this kind is unknown. Please fix the input.";
	}
	
	return bResult;
}


bool BucketSpecification::execute(EmdrosEnv *pEnv, const SetOfMonads& substrate, std::string& error_message)
{
	std::string query = getQuery(substrate);
	// std::cerr << "UP200: query = " << query << std::endl;
	
	bool bCompilerResult = false;
	bool bPrintResult = false;
	bool bPrintError = false;
	bool bDBResult = pEnv->executeString(query,
					     bCompilerResult,
					     bPrintResult,
					     bPrintError);
	if (!bDBResult || !bCompilerResult) {
		error_message += "\nCompiler or database error executing query: " + query + "\n";
		return false;
	} else {
		m_pSheaf = pEnv->takeOverSheaf();

		// If the sheaf is failed or empty, return false
		if (m_pSheaf->isFail()
		    || !m_pSheaf->const_iterator().hasNext()) {
			delete m_pSheaf;
			m_pSheaf = 0;
			error_message = "Sheaf is empty or failed. Wrong 'expression' parameter?\nexpression = " + m_expression + "\nquery =\n" + query + "\n";
			return false;
		}

		bool bResult = true;
		if (m_inner_bucket_specification != 0) {
			SetOfMonads inner_substrate;
			bool bUseOnlyFocusMonads = false;
			m_pSheaf->getSOM(inner_substrate, bUseOnlyFocusMonads);

			bResult = m_inner_bucket_specification->execute(pEnv, inner_substrate, error_message);
		} 

		return bResult;
	}
}





BucketSpecification *BucketSpecification::getInnerBucketSpecification()
{
	return m_inner_bucket_specification;
}

void BucketSpecification::setInnerBucketSpecification(BucketSpecification *inner_bucket_specification)
{
	delete m_inner_bucket_specification;
	m_inner_bucket_specification = inner_bucket_specification;
}




void BucketSpecification::clean()
{
	delete m_pSheaf;
	m_pSheaf = 0;
}


void BucketSpecification::prettyPrint(std::ostream& ostr, int indent)
{
	local_print_indent(ostr, indent);
	ostr << "{\n";
	
	local_print_indent(ostr, indent+1);
	ostr << "OTN: \"" << m_object_type_name << "\"\n";

	local_print_indent(ostr, indent+1);
	ostr << "feature: [" << joinList(",", m_feature_name_list) << "]\n";
	
	local_print_indent(ostr, indent+1);
	ostr << "expression: \"" << m_expression << "\"\n";

	if (m_inner_bucket_specification) {
		local_print_indent(ostr, indent+1);
		ostr << "buckets:\n";
		m_inner_bucket_specification->prettyPrint(ostr, indent+1);
	}
	
	local_print_indent(ostr, indent);
	ostr << "}\n";
}

Bucket *BucketSpecification::makeBucket(BucketSpecification *pTopBucketSpecification)
{
	eBucketKind top_bucket_kind = pTopBucketSpecification->getBucketKind();
	std::string top_object_type_name = pTopBucketSpecification->m_object_type_name;

	std::string child_object_type_name;
	eBucketKind child_bucket_kind = pTopBucketSpecification->getChildBucketKind(child_object_type_name);

	Bucket *pTopLevelBucket = Bucket::newBucket(top_bucket_kind, top_object_type_name, child_bucket_kind);

	int depth = 0;
	BucketSpecification *pBucketSpecification = pTopBucketSpecification;

	while (pBucketSpecification != 0) {
		pBucketSpecification->makeBucketStructure(pTopLevelBucket, depth);

		++depth;
		pBucketSpecification = pBucketSpecification->m_inner_bucket_specification;
	}
		
	return pTopLevelBucket;
}

void BucketSpecification::makeBucketStructure(Bucket *pTopLevelBucket, int depth)
{
	eBucketKind bucket_kind = getBucketKind();

	std::string child_object_type_name;
	eBucketKind child_bucket_kind = getChildBucketKind(child_object_type_name);
	bool bHasChild = m_inner_bucket_specification != 0;

	// Calculate grandchild's bucket kind (if a grandchild exists,
	// otherwise default to kBKCount, which is used here in lieu
	// of 'kBKNone'.
	eBucketKind grandchild_bucket_kind = kBKCount;
	if (bHasChild) {
		std::string dummy_grandchild_bucket_otn;
		grandchild_bucket_kind = m_inner_bucket_specification->getChildBucketKind(dummy_grandchild_bucket_otn);
		(void) dummy_grandchild_bucket_otn; // Silence a warning
	} else {
		grandchild_bucket_kind = kBKCount;
	}
			      

	std::vector<std::string> feature_name_vec;
	std::vector<std::string> feature_value_vec;
	
	if (m_feature_name_list.empty()) {
		if (child_bucket_kind == kBKCount) {
			feature_name_vec.push_back("");
			feature_value_vec.push_back("");
		} else {
			feature_name_vec.push_back("first_monad");
			feature_value_vec.push_back("");
		}
	} else {
		std::list<std::string>::const_iterator fn_ci = m_feature_name_list.begin();
		std::list<std::string>::const_iterator fn_cend = m_feature_name_list.end();
		while (fn_ci != fn_cend) {
			feature_name_vec.push_back(*fn_ci);
			feature_value_vec.push_back("");
			++fn_ci;
		}
	}
	
	std::list<std::string>::size_type feature_name_list_size = m_feature_name_list.size();
	std::vector<std::string>::size_type feature_name_vec_size = feature_name_vec.size();
		
	SheafConstIterator sheaf_ci = m_pSheaf->const_iterator();
	while (sheaf_ci.hasNext()) {
		const Straw *pStraw = sheaf_ci.next();
		StrawConstIterator straw_ci = pStraw->const_iterator();
		while (straw_ci.hasNext()) {
			const MatchedObject *pMO = straw_ci.next();
			monad_m first_monad = pMO->getFirst();
			monad_m last_monad = pMO->getLast();

			if (m_feature_name_list.empty()) {
				if (child_bucket_kind == kBKCount) {
					feature_value_vec[0] = "";
				} else {
					feature_value_vec[0] = monad_m2string(first_monad);
				}
			} else {
				std::list<std::string>::size_type index;
				for (index = 0;
				     index < feature_name_list_size;
				     ++index) {
					feature_value_vec[index] = pMO->getFeatureAsString(index);
				}
			}
			
			std::vector<std::string>::size_type feature_index;
			for (feature_index = 0;
			     feature_index < feature_name_vec_size;
			     ++feature_index) {
				std::string feature_name = feature_name_vec[feature_index];
				std::string feature_value = feature_value_vec[feature_index];
				BucketValue myBucketValue(this->m_object_type_name,
							  feature_name,
							  feature_value,
							  first_monad,
							  last_monad,
							  bucket_kind);
				std::list<Bucket*> bucket_list;

				pTopLevelBucket->getBucketListFromMonad(myBucketValue, depth, child_bucket_kind, child_object_type_name, grandchild_bucket_kind, bucket_list);
				std::list<Bucket*>::iterator bucket_it1 = bucket_list.begin();
				std::list<Bucket*>::iterator bucket_it1end = bucket_list.end();
				while (bucket_it1 != bucket_it1end) {
					Bucket *pThisBucket = *bucket_it1;


					if (!bHasChild) {
						pThisBucket->incrementCountInChild(myBucketValue);
					}
					
					++bucket_it1;
				}
			}
		}
	}
}

eBucketKind BucketSpecification::getBucketKind() const
{
	eBucketKind bucket_kind;

	bool bOTNIsBin = getOTNIsBin();
	if (bOTNIsBin) {
		bucket_kind = kBKBin;
	} else {
		bucket_kind = kBKBucket;
	}
	
	return bucket_kind;
}

eBucketKind BucketSpecification::getChildBucketKind(std::string& child_object_type_name) const
{
	if (m_inner_bucket_specification == 0) {
		child_object_type_name = "";
		return kBKCount;
	} else {
		child_object_type_name = m_inner_bucket_specification->m_object_type_name;
		return m_inner_bucket_specification->getBucketKind();
	}
}

	


// Helper function
std::string getStringFromJSONDict(const JSONValue *pDict, const std::string& key)
{
	const JSONValue *pValue = pDict->getObjectValue(key);
	if (pValue == 0) {
		return "";
	} else if (pValue->getKind() == kJSONString) {
		return pValue->getString();
	} else {
		return "";
	}
}
	


BucketSpecification *getBucketSpecificationFromJSONValue(const JSONValue *pJSONValue)
{
	if (pJSONValue->getKind() != kJSONObject) {
		return 0;
	} else {
		std::string object_type_name;
		std::list<std::string> feature_name_list;
		std::string expression;
		std::string bucket_kind_override;
		BucketSpecification *pInnerBucketSpecification = 0;

		// This will return 0 if "buckets" is not a key in pJSONValue.
		const JSONValue *pBucketsDict = pJSONValue->getObjectValue("buckets");
		object_type_name = getStringFromJSONDict(pJSONValue, "objectTypeName");
		if (pJSONValue->hasObjectKey("feature")) {
			const JSONValue *pFeature = pJSONValue->getObjectValue("feature");
			if (pFeature->getKind() == kJSONString) {
				std::string feature_name = pFeature->getString();
				if (feature_name != "") {
					feature_name_list.push_back(feature_name);
				}
			} else if (pFeature->getKind() == kJSONList) {
				const std::list<JSONValue*>& feature_list = pFeature->getList();
				std::list<JSONValue*>::const_iterator ci = feature_list.begin();
				std::list<JSONValue*>::const_iterator cend = feature_list.end();
				while (ci != cend) {
					const JSONValue *pListMember = *ci;
					if (pListMember->getKind() == kJSONString) {
						std::string feature_name = pListMember->getString();
						if (feature_name != "") {
							feature_name_list.push_back(feature_name);
						}
					}
					++ci;
				}
			} else {
				ASSERT_THROW(false,
					     "We should not get here. Error in input?");
			}
		} else {
			// The feature key is missing
		}

		expression = getStringFromJSONDict(pJSONValue, "expression");

		bucket_kind_override = getStringFromJSONDict(pJSONValue, "bucket_kind");
		
		BucketSpecification *pResult =
			new BucketSpecification(object_type_name,
						feature_name_list,
						expression,
						bucket_kind_override);
		if (pBucketsDict != 0) {
			pInnerBucketSpecification = getBucketSpecificationFromJSONValue(pBucketsDict);
			pResult->setInnerBucketSpecification(pInnerBucketSpecification);
		}

		return pResult;
	}
}

BucketSpecification *getBucketSpecificationFromJSONString(const std::string& json_string, std::string& error_message)
{
	const JSONValue *pValue = readAndParseJSONFromString(json_string, error_message);
	if (pValue == 0) {
		error_message += "\ngetBucketSpecificationFromJSONString(): JSON could not be parsed.\n";
		return 0;
	} else {
		BucketSpecification *pResult = getBucketSpecificationFromJSONValue(pValue);
		delete pValue;
		if (pResult->weed(error_message)) {
			return pResult;
		} else {
			error_message += "Error in weeding bucket specification.\n";
			delete pResult;
			return 0;
		}
	}
}


Bucket *getBucketFromJSONBucketSpecification(EmdrosEnv *pEnv, const std::string& json_string, const SetOfMonads& substrate, std::string& error_message)
{
	BucketSpecification *pBucketSpecification = getBucketSpecificationFromJSONString(json_string, error_message);

	if (pBucketSpecification == 0) {
		return 0;
	} else {
		// UP200:
		// pBucketSpecification->prettyPrint(std::cerr);
		
		bool bResult = pBucketSpecification->execute(pEnv, substrate, error_message);
		if (!bResult) {
			delete pBucketSpecification;
			return 0;
		} else {
			Bucket *pResult = BucketSpecification::makeBucket(pBucketSpecification);
			delete pBucketSpecification;
			return pResult;
		}
	}
}









/////////////////////////////////////////////////////////////////
//
// Bucket
//
/////////////////////////////////////////////////////////////////
Bucket::Bucket(eBucketKind bucket_kind, eBucketKind child_bucket_kind)
{
	if (bucket_kind == kBKCount) {
		m_kind_or_count = 0;
	} else if (bucket_kind == kBKBucket) {
		switch (child_bucket_kind) {
		case kBKCount:
			m_kind_or_count = -10;
		case kBKBucket:
			m_kind_or_count = -11;
		case kBKBin:
			m_kind_or_count = -12;
			break;
		default:
			ASSERT_THROW(false, "Unknown child_bucket_kind.");
		}
	} else if (bucket_kind == kBKBin) {
		switch (child_bucket_kind) {
		case kBKCount:
			m_kind_or_count = -20;
		case kBKBucket:
			m_kind_or_count = -21;
		case kBKBin:
			m_kind_or_count = -22;
			break;
		default:
			ASSERT_THROW(false, "Unknown child_bucket_kind.");
		}
	} else {
		ASSERT_THROW(false,
			     "Logic error: We should not be able to get here.");
	}
}


Bucket::~Bucket()
{
}


eBucketKind Bucket::getKind() const
{
	switch (m_kind_or_count) {
	case -22:
	case -21:
	case -20:
		return kBKBin;
	case -12:
	case -11:
	case -10:
		return kBKBucket;
	default:
		ASSERT_THROW(m_kind_or_count >= 0,
			     "ERROR: Unknown m_kind_or_count = " + long2string(m_kind_or_count));
		return kBKCount;
	}
}


eBucketKind Bucket::getChildKind() const
{
	switch (m_kind_or_count) {
	case -22:
	case -12:
		return kBKBin;
		break;
	case -21:
	case -11:
		return kBKBucket;
		break;
	case -20:
	case -10:
		return kBKCount;
		break;
	default:
		ASSERT_THROW(m_kind_or_count >= 0,
			     "ERROR: Unknown m_kind_or_count = " + long2string(m_kind_or_count));
		return kBKCount;
	}
}

Bucket *Bucket::newBucket(eBucketKind bucket_kind, const std::string& object_type_name, eBucketKind child_bucket_kind)
{
	Bucket *pResult = 0;
	if (bucket_kind == kBKCount) {
		pResult = new Bucket(kBKCount, kBKCount);
	} else if (bucket_kind == kBKBucket
		   || bucket_kind == kBKBin) {
		pResult = new BucketBucket(bucket_kind, object_type_name, child_bucket_kind);
	} else {
		ASSERT_THROW(false,
			     "ERROR: Unknown bucket_kind. We updated the eBucketKind enum, but did not update this code. Please fix.");
	}
	return pResult;
}

void Bucket::addBucketValue(const BucketValue& bv, eBucketKind child_bucket_kind, const std::string& child_object_type_name, eBucketKind grandchild_bucket_kind)
{
	ASSERT_THROW(false,
		     "ERROR: Bucket::addBucketValue() must not be called on Bucket.");
}


void Bucket::getBucketListFromMonad(const BucketValue& myBucketValue, int depth, eBucketKind child_bucket_kind, const std::string& child_object_type_name, eBucketKind grandchild_bucket_kind, std::list<Bucket*>& /* out */ bucket_list)
{
	ASSERT_THROW(false,
		     "ERROR: Bucket::getBucketListFromMonad() must not be called except on BucketBucket.");
}


void Bucket::incrementCountInChild(const BucketValue& bv)
{
	ASSERT_THROW(false,
		     "ERROR: Bucket::incrementCountInChild() called. This should only be called on a BucketBucket object.");
}

void Bucket::incrementCount()
{
	ASSERT_THROW(getKind() == kBKCount,
		     "ERROR: Bucket::increment() called even though getKind() was != kBKCount");
	++m_kind_or_count;
}

long Bucket::getCount() const
{
	ASSERT_THROW(getKind() == kBKCount,
		     "ERROR: Bucket::getCount() called even though getKind() was != kBKCount");
	return m_kind_or_count;
}


void Bucket::prettyPrint(std::ostream& out, int indent) const
{
	switch (getKind()) {
	case kBKCount:
		local_print_indent(out, indent);
		out << m_kind_or_count << '\n';
		break;
	}
}


#define ADD_CHAR(C) pResult->addChar(C);

#define ADD_SZ(STR) pResult->addCharsSimple(STR, sizeof(STR)-1);

#define ADD_STRING(S) pResult->addCharsSimple(S.c_str(), S.length());

void Bucket::getJSONInBigstring(Bigstring *pResult) const
{
	ASSERT_THROW(getKind() == kBKCount,
		     "ERROR: Bucket::getJSONInBigstring() must be implemented in all subclasses but for kind == kBKCount.");

	std::string str_count = long2string(m_kind_or_count);

	ADD_STRING(str_count);
}


/** Retrieve a JSON representation of the Bucket.
 *
 *
 * @return The JSON representation of the Bucket and any inner
 * Buckets.
 *
 */
std::string Bucket::getJSON() const
{
	Bigstring *pResult = new Bigstring();

	this->getJSONInBigstring(pResult);
	
	std::string result;
	result = pResult->toString();

	delete pResult;
	
	return result;
}




/////////////////////////////////////////////////////////////////
//
// BucketBucket
//
/////////////////////////////////////////////////////////////////

BucketBucket::BucketBucket(eBucketKind newKind, const std::string& object_type_name, eBucketKind child_kind)
	: Bucket(newKind, child_kind),
	  m_object_type_name(object_type_name)
{
}


BucketBucket::~BucketBucket()
{
	String2String2PBucketMap::iterator it1 = m_feature_map.begin();
	String2String2PBucketMap::iterator it1end = m_feature_map.end();
	while (it1 != it1end) {
		String2PBucketMap::iterator it2 = it1->second.begin();
		String2PBucketMap::iterator it2end = it1->second.end();
		while (it2 != it2end) {
			Bucket *pBucket = it2->second;

			delete pBucket;

			++it2;
		}

		++it1;

	}
	m_feature_map.clear();
	m_monad_map.clear();
	m_first_monad_map.clear();
}

void BucketBucket::incrementCountInChild(const BucketValue& bv)	
{
	String2String2PBucketMap::iterator fit1 = m_feature_map.find(bv.m_feature_name);
	if (fit1 == m_feature_map.end()) {
		String2PBucketMap new_map;
		Bucket *pNewBucket = new Bucket(kBKCount, kBKCount);
		pNewBucket->incrementCount();
		new_map.insert(std::make_pair(bv.m_feature_value, pNewBucket));
		m_feature_map.insert(std::make_pair(bv.m_feature_name, new_map));
	} else {
		String2PBucketMap::iterator spit1 = fit1->second.find(bv.m_feature_value);
		Bucket *pInnerBucket = 0;
		if (spit1 == fit1->second.end()) {
			pInnerBucket = new Bucket(kBKCount, kBKCount);
			fit1->second[bv.m_feature_value] = pInnerBucket;
		} else {
			pInnerBucket = spit1->second;
			if (pInnerBucket == 0) {
				pInnerBucket = new Bucket(kBKCount, kBKCount);
				fit1->second[bv.m_feature_value] = pInnerBucket;
			}
		}
		pInnerBucket->incrementCount();
	}
}


Bucket *BucketBucket::getBucketFromFeatureNameAndValue(const std::string& feature_name, const std::string& feature_value)
{
	String2String2PBucketMap::iterator fit1 = m_feature_map.find(feature_name);
	if (fit1 == m_feature_map.end()) {
		// Not found
		return 0;
	} else {
		String2PBucketMap::iterator spit1 = fit1->second.find(feature_value);
		String2PBucketMap::iterator spit1end = fit1->second.end();
		if (spit1 != spit1end) {
			Bucket *pBucket = spit1->second;
			return pBucket;
		} else {
			return 0;
		}
	}
}

void BucketBucket::getBucketListFromFeatureName(const std::string& feature_name, std::list<Bucket*>& feature_bucket_list)
{
	String2String2PBucketMap::iterator fit1 = m_feature_map.find(feature_name);
	if (fit1 == m_feature_map.end()) {
		// Nothing to do.
	} else {
		String2PBucketMap::iterator spit1 = fit1->second.begin();
		String2PBucketMap::iterator spit1end = fit1->second.end();
		while (spit1 != spit1end) {
			Bucket *pBucket = spit1->second;
			feature_bucket_list.push_back(pBucket);

			++spit1;
		}
	}
}
	

void BucketBucket::getBucketListFromMonad(const BucketValue& bv, int depth, eBucketKind child_bucket_kind, const std::string& child_object_type_name, eBucketKind grandchild_bucket_kind, std::list<Bucket*>& /* out */ bucket_list)
{
	if (depth == 0) {
		addBucketValue(bv, child_bucket_kind, child_object_type_name, grandchild_bucket_kind);
		bucket_list.push_back(this);
	} else {
		monad_m monad = bv.m_last_monad;
		
		Monad2String2StringSetMap::iterator mit1 = m_monad_map.lower_bound(monad);
		if (mit1 == m_monad_map.end()) {
			Monad2String2StringSetMap::reverse_iterator rmit1 = m_monad_map.rbegin();
			mit1 = m_monad_map.find(rmit1->first);
		}

		// Go back one more than we need to, or until the
		// beginning, whichever comes first
		while (mit1 != m_monad_map.begin()
		       && mit1->first >= bv.m_first_monad) {
			--mit1;
		}

		// Go forwards if necessary
		if (mit1 != m_monad_map.end()
		    && (mit1->first < bv.m_first_monad
			|| m_first_monad_map[mit1->first] > bv.m_first_monad)) {
			++mit1;
		}

		while (mit1 != m_monad_map.end()) {
			ASSERT_THROW(mit1->first >= bv.m_last_monad
				     || mit1->first >= bv.m_first_monad,
				     "ERROR in logic: This monad-assert should be true by now.");
			

			String2StringSetMap::iterator msetit1 = mit1->second.begin();
			String2StringSetMap::iterator msetit1end = mit1->second.end();
			while (msetit1 != msetit1end) {
				std::string feature_name = msetit1->first;

				StringSet::iterator setit1 = msetit1->second.begin();
				StringSet::iterator setit1end = msetit1->second.end();
				while (setit1 != setit1end) {
					std::string feature_value = *setit1;
					
					Bucket *pInnerBucket = getBucketFromFeatureNameAndValue(feature_name, feature_value);
					
					if (pInnerBucket != 0) {
						pInnerBucket->getBucketListFromMonad(bv, depth-1, child_bucket_kind, child_object_type_name, grandchild_bucket_kind, bucket_list);
					}
						
					++setit1;
				}
				
				++msetit1;
			}
			if (mit1->first <= bv.m_last_monad) {
				++mit1;
				if (mit1 == m_monad_map.end()) {
					break;
				} else if (m_first_monad_map[mit1->first] > bv.m_last_monad) {
					break;
				}
			} else {
				break;
			}
		}
	}
}



void BucketBucket::addBucketValue(const BucketValue& bv, eBucketKind child_bucket_kind, const std::string& child_object_type_name, eBucketKind grandchild_bucket_kind)
{
	std::string feature_value;
	switch (getKind()) {
	case kBKBin:
		feature_value = monad_m2string(bv.m_first_monad) + ":" + bv.m_feature_value;
		break;
	case kBKBucket:
		feature_value = bv.m_feature_value;
		break;
	case kBKCount:
		ASSERT_THROW(false,
			     "ERROR: BucketBucket::getKind() == kBKCount, yet this should not be possible here. Please fix the logic.\n");
		break;
	default:
		ASSERT_THROW(false,
			     "ERROR: BucketBucket::getKind(): value is unknown. We changed the eBucketKind enum without changing this code. Please fix the code.\n");
		break;
	}
	// m_feature_map
	String2String2PBucketMap::iterator fit1 =  m_feature_map.find(bv.m_feature_name);
	if (fit1 == m_feature_map.end()) {
		String2PBucketMap new_map;
		Bucket *pChildBucket = Bucket::newBucket(child_bucket_kind, child_object_type_name, grandchild_bucket_kind);
		new_map.insert(std::make_pair(feature_value, pChildBucket));
		m_feature_map.insert(std::make_pair(bv.m_feature_name, new_map));
	} else {
		String2PBucketMap::iterator fit2 = fit1->second.find(feature_value);
		if (fit2 == fit1->second.end()) {
			Bucket *pChildBucket = Bucket::newBucket(child_bucket_kind, child_object_type_name, grandchild_bucket_kind);
			fit1->second.insert(std::make_pair(feature_value, pChildBucket));
		} else {
			if (fit2->second == (Bucket*) 0) {
				Bucket *pChildBucket = Bucket::newBucket(child_bucket_kind, child_object_type_name, grandchild_bucket_kind);
				fit1->second[feature_value] = pChildBucket;
			} else {
				// Nothing to do.
			}
		}
	}

	// m_monad_map
	Monad2String2StringSetMap::iterator mit1 = m_monad_map.find(bv.m_last_monad);
	if (mit1 == m_monad_map.end()) {
		StringSet new_set;
		new_set.insert(feature_value);
		String2StringSetMap new_map;
		new_map.insert(std::make_pair(bv.m_feature_name, new_set));
		m_monad_map.insert(std::make_pair(bv.m_last_monad, new_map));
	} else {
		String2StringSetMap::iterator mfit1 = mit1->second.find(bv.m_feature_name);
		if (mfit1 == mit1->second.end()) {
			StringSet new_set;
			new_set.insert(feature_value);
			mit1->second.insert(std::make_pair(bv.m_feature_name, new_set));
		} else {
			// Add it regardless of whether it is there already.
			// This is a set, so this does no harm, and is faster
			// than first searching for it, then
			// inserting it if it is not there.
			mfit1->second.insert(feature_value);
		}
	}

	// m_first_monad_map
	m_first_monad_map[bv.m_last_monad] = bv.m_first_monad;
}


void BucketBucket::prettyPrint(std::ostream& ostr, int indent) const
{
	local_print_indent(ostr, indent);
	ostr << "{\n";
	
	local_print_indent(ostr, indent+1);
	ostr << "OTN: \"" << m_object_type_name << "\"\n";

	local_print_indent(ostr, indent);
	ostr << "}\n";
}


void BucketBucket::getJSONInBigstring(Bigstring *pResult) const
{
	eBucketKind myKind = getKind();
		
	ADD_SZ("{\"");
	ADD_STRING(m_object_type_name);
	ADD_SZ("\":");

	String2String2PBucketMap::const_iterator ci1 = m_feature_map.begin();

	// Is this a next-to-ininermost bucket whose feature
	// name is empty and whose only feature value is
	// empty?
	if (m_feature_map.size() == 1
	    && ci1->first.empty()) {
		// Yes (and the asserts below prove it).

		ASSERT_THROW(ci1->second.size() == 1,
			     "Error: We should only have one feature value, and it should be empty, when the feature name is empty (probably this is something that got changed in BucketSpecification::makeBucket or one of its callees).");
		String2PBucketMap::const_iterator ci2 = ci1->second.begin();
		ASSERT_THROW(ci2->first.empty(),
			     "Error: We should only have an empty feature value.");
		Bucket *pBucket = ci2->second;
		
		
		if (pBucket != 0) {
			ASSERT_THROW(pBucket->getKind() == kBKCount,
				     "Logic error: The pBucket->getKind() should be kBKCount.");
			pBucket->getJSONInBigstring(pResult);
		}
	} else {
		String2String2PBucketMap::const_iterator ci1end = m_feature_map.end();
		if (myKind == kBKBin) {
			ADD_SZ("[");				
		}

		ADD_CHAR('{');

		std::string prev_first_monad;
		std::string first_monad;
		
		while (ci1 != ci1end) {
			
			std::string feature_name = ci1->first;

			ADD_CHAR('\"');
			ADD_STRING(feature_name);
			ADD_SZ("\":{");
			
			String2PBucketMap::const_iterator ci2 = ci1->second.begin();
			String2PBucketMap::const_iterator ci2end = ci1->second.end();
			while (ci2 != ci2end) {
				std::string feature_value = ci2->first;
				Bucket *pBucket = ci2->second;
				
				if (myKind == kBKBin) {
					// Cut off up to the first
					// ':', since we added the
					// first_monad + ":" in
					// BucketBucket::addBucketValue().
					std::string::size_type colon_index = feature_value.find_first_of(":");
					feature_value = feature_value.substr(colon_index + 1, std::string::npos);
					first_monad = feature_value.substr(0, colon_index);
				}
				
				
				
				ADD_CHAR('\"');
				ADD_STRING(feature_value);
				ADD_SZ("\":");
				
				if (pBucket != 0) {
					pBucket->getJSONInBigstring(pResult);
				}
				
				++ci2;
				
				
				if (myKind == kBKBin) {
					if (prev_first_monad != first_monad) {
						prev_first_monad = first_monad;
						if (ci2 != ci2end) {
							ADD_SZ("}},{\"");
							ADD_STRING(feature_name);
							ADD_SZ("\":{");
						} else {
							//ADD_CHAR('}');
						}
					} else {
						if (ci2 != ci2end) {
							ADD_CHAR(',');
						}
					}
				}  else {
					if (ci2 != ci2end) {
						ADD_CHAR(',');
					}
				}
				
			}

			ADD_SZ("}");				

			++ci1;
			
			if (ci1 != ci1end) {
				ADD_CHAR(',');
			}

		}

			
		ADD_SZ("}");
		
		if (myKind == kBKBin) {
			ADD_CHAR(']');				
		} 
	}

	ADD_CHAR('}');
}



/////////////////////////////////////////////////////////////////
//
// TokenBucket: For simple counting of tokens
//
/////////////////////////////////////////////////////////////////


TokenBucket::TokenBucket()
{
}

TokenBucket::TokenBucket(const std::set<std::string>& stop_word_set)
: m_stop_word_set(stop_word_set)
{
}


TokenBucket::~TokenBucket()
{
}


void TokenBucket::countInSheaf(const Sheaf* pSheaf)
{
    SheafConstIterator sheaf_ci = pSheaf->const_iterator();
    while (sheaf_ci.hasNext()) {
        const Straw *pStraw = sheaf_ci.next();
        StrawConstIterator straw_ci = pStraw->const_iterator();
        
        while (straw_ci.hasNext()) {
            const MatchedObject *pMO = straw_ci.next();
            
            std::string surface_fts = pMO->getFeatureAsString(0);
            
            const bool is_stop_word = m_stop_word_set.find(surface_fts) != m_stop_word_set.end();
            if (!is_stop_word) {
                String2IntMap::iterator it = m_token_count_map.find(surface_fts);
                if (it == m_token_count_map.end()) {
                    m_token_count_map[surface_fts] = 1;
                    
                } else {
                    m_token_count_map[surface_fts] = it->second + 1;
                }
            }
        }
    }
}


std::string TokenBucket::getJSON() const
{
	Bigstring *pResult = new Bigstring();

	this->getJSONInBigstring(pResult);
	
	std::string result;
	result = pResult->toString();

	delete pResult;
	
	return result;
}


void TokenBucket::getJSONInBigstring(Bigstring *pResult) const
{
	ADD_CHAR('{');

	String2IntMap::const_iterator ci = m_token_count_map.begin();
	String2IntMap::const_iterator cend = m_token_count_map.end();
	while (ci != cend) {
		const std::string& surface_fts = ci->first;
		int count = ci->second;

		ADD_CHAR('"');

		ADD_STRING(surface_fts);

		ADD_SZ("\":");

		ADD_STRING(long2string(count));
		
		++ci;
		if (ci != cend) {
			ADD_CHAR(',');
		}

	}

	ADD_CHAR('}');
}






/* Make sure we can do an amalgamation with more than one #define for these. */
#undef ADD_SZ
#undef ADD_STRING
#undef ADD_CHAR
