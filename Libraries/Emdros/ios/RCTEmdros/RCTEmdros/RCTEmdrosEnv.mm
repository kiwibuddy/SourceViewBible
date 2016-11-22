//
//  Emdros.mm
//  EmdrosKit
//
//  Copyright © 2016 Overcommitted, LLC. All rights reserved.
//

#import "RCTEmdrosEnv.h"
#import "emdros.h"
#import "bucket.h"
#import "harvest.h"
#include <fstream>
#import "OCDBenchmark.h"

const char RCTKeyCString[] = {48, 120, 54, 55, 100, 51, 100, 54, 55, 100, 32, 48, 120, 50, 50, 55, 57, 56, 53, 48, 57, 32, 48, 120, 49, 51, 101, 54, 98, 49, 99, 57, 32, 48, 120, 51, 52, 99, 50, 50, 51, 57, 55, 32, 48, 120, 54, 49, 101, 49, 98, 53, 98, 49, 32, 48, 120, 51, 56, 99, 52, 100, 49, 98, 49, 32, 48, 120, 50, 53, 101, 51, 102, 54, 100, 57, 32, 48, 120, 49, 97, 50, 102, 50, 57, 100, 55, 0};
#define RCTKey [NSString stringWithCString:RCTKeyCString encoding:NSASCIIStringEncoding]

const std::set<std::string> RCTStopwords = {"the","and","of","to","you","will","in","I","a","he","for","they","your","is","with","his","from","that","be","all","them","as","who","it","was","but","my","have","s","this","their","are","me","on","him","people","then","so","not","when","were","had","king","what","by","we","at","said","one","has","t","do","son","out","if","there","no","or","land","like","us","must","these","up","those","her","day","our","now","man","into","am","can","come","let","because","go","about","against","give","down","even","don","an","over","other","she","before","made","been","men","its"};

@interface RCTEmdrosEnv () {
    EmdrosEnv *_emdrosEnv;
}

@property (strong) dispatch_queue_t queue;
@property (copy) NSDictionary *options;
@end

@implementation RCTEmdrosEnv

- (void)dealloc {
    if (_emdrosEnv) delete _emdrosEnv;
}

- (instancetype)initWithOptions:(NSDictionary *)options {
    self = [super init];
    if (self) {
        _queue = dispatch_queue_create("com.facebook.React.Emdros.Query", DISPATCH_QUEUE_CONCURRENT);
        _options = options;
    }

    return self;
}

- (void)connect:(void (^)(BOOL isConnected, NSError *error))completion {
    if (!_emdrosEnv) {
        NSString *databasePath = self.options[@"databasePath"];

        eOutputKind output_kind = kOKConsole;
        std::string initial_db(databasePath.UTF8String);
        std::string hostname("localhost");
        std::string user("emdf");
        eBackendKind backend_kind = kBPT;
        std::string password(RCTKey.UTF8String);

        _emdrosEnv = new EmdrosEnv(output_kind, kCSUTF8, hostname, user, password, initial_db, backend_kind);
    }

    BOOL isConnected = _emdrosEnv->connectionOk() == true;
    if (completion) completion(isConnected, nil);
}

- (void)query:(NSString *)query options:(NSDictionary *)options completion:(void (^)(id result, NSError *error))completion {
    try {
        if ([options[@"count"] boolValue]) {
//           [[OCDBenchmark sharedBenchmark] begin];

            NSInteger firstMonad = options[@"firstMonad"] ? [options[@"firstMonad"] integerValue] : 1;
            NSInteger lastMonad = options[@"lastMonad"] ? [options[@"lastMonad"] integerValue] : MAX_MONAD;
            SetOfMonads substrate(firstMonad, lastMonad);

            std::string errorMessage;
            std::string json = countInBuckets(_emdrosEnv, std::string(query.UTF8String), substrate, errorMessage);
//            [[OCDBenchmark sharedBenchmark] end:[NSString stringWithFormat:@"%@ countInBuckets", query]];

//            [[OCDBenchmark sharedBenchmark] begin];
            NSString *data = [NSString stringWithUTF8String:json.c_str()];
            NSError *error = nil;
            NSDictionary *result = [NSJSONSerialization JSONObjectWithData:[data dataUsingEncoding:NSUTF8StringEncoding] options:0 error:&error];
//            [[OCDBenchmark sharedBenchmark] end:[NSString stringWithFormat:@"%@ JSONObjectWithData", query]];

            if (completion) completion(result, nil);
        } else {

        }
    } catch (EMdFDBException e) {
        std::cerr << "ERROR: EMdFDBException (Database error)..." << std::endl;
        std::cerr << _emdrosEnv->getDBError() << std::endl;
        std::cerr << _emdrosEnv->getCompilerError() << std::endl;
    } catch (BadMonadsException e) {
        std::cerr << "BadMonadsException caught.  Program aborted." << std::endl;
    } catch (WrongCharacterSetException e) {
        std::cerr << "WrongCharacterSetException caught.  Program aborted." << std::endl;
    } catch (EMdFOutputException e) {
        std::cerr << "EMdFOutputException caught.  Program aborted." << std::endl;
    } catch (EmdrosException e) {
        std::cerr << "ERROR: EmdrosException (Emdros error)..." << e.what() << std::endl;
    } catch (...) {
        std::cerr << "Unknown exception occurred.  Program aborted." << std::endl;
    }
}

- (void)wordsInMonads:(NSArray<NSArray<NSNumber *> *> *)monads limit:(NSInteger)limit useStopWords:(BOOL)useStopWords completion:(void (^)(id result, NSError *error))completion {
    try {
        SetOfMonads soms;

        if (!monads) monads = @[@[@(1), @(MAX_MONAD)]];
        for (NSArray<NSNumber *> *monad in monads) {
            SetOfMonads som(monad.firstObject.integerValue, monad.lastObject.integerValue);
            soms.unionWith(som);
        }

        std::set<std::string> stopwords = {};
        if (useStopWords) stopwords = RCTStopwords;

        std::string errorMessage;
        String2IntMap wordCountMap;
        getWordCountsInSOM(_emdrosEnv, soms, stopwords, wordCountMap, errorMessage);

        NSMutableDictionary *result = [[NSMutableDictionary alloc] init];
        for (auto const& iterator : wordCountMap) {
            NSString *word = [NSString stringWithUTF8String:iterator.first.c_str()];
            NSInteger wordCount = iterator.second;
            [result setObject:@(wordCount) forKey:word];
        }

        NSArray *words = [result keysSortedByValueUsingComparator:^NSComparisonResult(NSNumber *  _Nonnull obj1, NSNumber *  _Nonnull obj2) {
            NSInteger a = obj1.integerValue;
            NSInteger b = obj2.integerValue;

            if (a > b) return (NSComparisonResult)NSOrderedAscending;
            if (a < b) return (NSComparisonResult)NSOrderedDescending;
            return (NSComparisonResult)NSOrderedSame;
        }];

        if (limit > 0) words = [words subarrayWithRange:NSMakeRange(0, MIN(limit, words.count))];

        NSMutableArray *wordCounts = [[NSMutableArray alloc] initWithCapacity:words.count];
        for (NSString *word in words) {
            [wordCounts addObject:@{@"string": word, @"count": result[word]}];
        }

        if (completion) completion([[NSArray alloc] initWithArray:wordCounts], nil);
    } catch (EMdFDBException e) {
        std::cerr << "ERROR: EMdFDBException (Database error)..." << std::endl;
        std::cerr << _emdrosEnv->getDBError() << std::endl;
        std::cerr << _emdrosEnv->getCompilerError() << std::endl;
    } catch (BadMonadsException e) {
        std::cerr << "BadMonadsException caught.  Program aborted." << std::endl;
    } catch (WrongCharacterSetException e) {
        std::cerr << "WrongCharacterSetException caught.  Program aborted." << std::endl;
    } catch (EMdFOutputException e) {
        std::cerr << "EMdFOutputException caught.  Program aborted." << std::endl;
    } catch (EmdrosException e) {
        std::cerr << "ERROR: EmdrosException (Emdros error)..." << e.what() << std::endl;
    } catch (...) {
        std::cerr << "Unknown exception occurred.  Program aborted." << std::endl;
    }
}

- (void)wordCountsForContext:(NSString *)context monads:(NSArray<NSArray<NSNumber *> *> *)monads contextFeatureComparison:(NSString *)contextFeatureComparison tokenFeatureComparison:(NSString *)tokenFeatureComparison completion:(void (^)(id result, NSError *error))completion {
    try {
        SetOfMonads soms;

        if (!monads) monads = @[@[@(1), @(MAX_MONAD)]];
        for (NSArray<NSNumber *> *monad in monads) {
            SetOfMonads som(monad.firstObject.integerValue, monad.lastObject.integerValue);
            soms.unionWith(som);
        }
        std::string errorMessage;

        ID_D2WordCountsMap wordCountMap;
        bool result = getWordCountsInContext(_emdrosEnv, soms, std::string(context.UTF8String), std::string(contextFeatureComparison.UTF8String), std::string(tokenFeatureComparison.UTF8String), wordCountMap, errorMessage);

        NSMutableDictionary *wordCounts = [[NSMutableDictionary alloc] init];
        if (result) {
            for (auto const& iterator : wordCountMap) {
                NSInteger contextID = iterator.first;
                NSDictionary *wordCount = @{
                    @"wordCount": @(iterator.second.m_word_count),
                    @"family": @(iterator.second.m_Family),
                    @"economics": @(iterator.second.m_Economics),
                    @"government": @(iterator.second.m_Government),
                    @"religion": @(iterator.second.m_Religion),
                    @"education": @(iterator.second.m_Education),
                    @"communication": @(iterator.second.m_MediaCom),
                    @"celebration": @(iterator.second.m_Celebration),
                };
                [wordCounts setObject:wordCount forKey:[NSString stringWithFormat:@"%li", contextID]];
            }
        }


        if (completion) completion([[NSDictionary alloc] initWithDictionary:wordCounts], nil);
    } catch (EMdFDBException e) {
        std::cerr << "ERROR: EMdFDBException (Database error)..." << std::endl;
        std::cerr << _emdrosEnv->getDBError() << std::endl;
        std::cerr << _emdrosEnv->getCompilerError() << std::endl;
    } catch (BadMonadsException e) {
        std::cerr << "BadMonadsException caught.  Program aborted." << std::endl;
    } catch (WrongCharacterSetException e) {
        std::cerr << "WrongCharacterSetException caught.  Program aborted." << std::endl;
    } catch (EMdFOutputException e) {
        std::cerr << "EMdFOutputException caught.  Program aborted." << std::endl;
    } catch (EmdrosException e) {
        std::cerr << "ERROR: EmdrosException (Emdros error)..." << e.what() << std::endl;
    } catch (...) {
        std::cerr << "Unknown exception occurred.  Program aborted." << std::endl;
    }
}


- (void)stringFrom:(NSInteger)from to:(NSInteger)to options:(NSDictionary *)options completion:(void (^)(id result, NSError *error))completion {
//    extern std::string render_objects(EmdrosEnv *pEnv, const std::string& db_name, const std::string& JSON_stylesheet, const std::string& stylesheet, monad_m first_monad, monad_m last_monad, bool& bResult);

    try {
//        [[OCDBenchmark sharedBenchmark] begin];

        NSString *stylesheet = ([options[@"stylesheet"] isKindOfClass:[NSString class]] ? options[@"stylesheet"] : [[NSString alloc] initWithData:[NSJSONSerialization dataWithJSONObject:options[@"stylesheet"] options:0 error:nil] encoding:NSUTF8StringEncoding]);

        std::string dbName("");
        std::string stylesheetString(stylesheet.UTF8String);
        std::string stylesheetName("base");
        bool bResult;
        std::string rendered_objects = render_objects(_emdrosEnv, dbName, stylesheetString, stylesheetName, from, to, bResult);
        NSString *string = [NSString stringWithUTF8String:rendered_objects.c_str()];

//        [[OCDBenchmark sharedBenchmark] end:[NSString stringWithFormat:@"stringFrom: %li, to: %li", (long)from, (long)to]];

        if (completion) completion(string, nil);
    } catch (EMdFDBException e) {
        std::cerr << "ERROR: EMdFDBException (Database error)..." << std::endl;
        std::cerr << _emdrosEnv->getDBError() << std::endl;
        std::cerr << _emdrosEnv->getCompilerError() << std::endl;
    } catch (BadMonadsException e) {
        std::cerr << "BadMonadsException caught.  Program aborted." << std::endl;
    } catch (WrongCharacterSetException e) {
        std::cerr << "WrongCharacterSetException caught.  Program aborted." << std::endl;
    } catch (EMdFOutputException e) {
        std::cerr << "EMdFOutputException caught.  Program aborted." << std::endl;
    } catch (EmdrosException e) {
        std::cerr << "ERROR: EmdrosException (Emdros error)..." << e.what() << std::endl;
    } catch (...) {
        std::cerr << "Unknown exception occurred.  Program aborted." << std::endl;
    }
}

- (NSString *)monadSetForBook:(NSString *)book {
    long firstMonad = 0;
    long lastMonad = 0;
    if (getMonadsForBook(_emdrosEnv, book.UTF8String, firstMonad, lastMonad)) {
        return [NSString stringWithFormat:@"{%ld-%ld}", firstMonad, lastMonad];
    }

    return nil;
}

- (NSDictionary *)monadSet:(NSDictionary *)options {
    NSString *query = options[@"query"];
    bool useOnlyFocusObjects = [options[@"useOnlyFocusObjects"] boolValue];

    SetOfMonads som;
    long firstMonad = 0;
    long lastMonad = 0;
    bool bResult = getSOMForQuery(_emdrosEnv, query.UTF8String, useOnlyFocusObjects, som);
    if (bResult && !som.isEmpty()) {
        firstMonad = som.first();
        lastMonad = som.last();
        return @{@"first": @(firstMonad), @"last": @(lastMonad)};
    }

    return nil;
}

- (void)wordOccurrencesForQuery:(NSString *)query completion:(void (^)(id result, NSError *error))completion {
    try {
        std::string errorMessage;
        
        WordOccurrenceSet wordOccurrenceSet;
        bool result = getWordOccurrencesForQuery(_emdrosEnv, std::string(query.UTF8String), wordOccurrenceSet, errorMessage);
        
        NSMutableArray *wordOccurrences = [[NSMutableArray alloc] init];
        if (result) {
            for (auto const& iterator : wordOccurrenceSet) {
                NSDictionary *wordOcccurrence = @{
                    @"id": @(iterator.m_id),
                    @"DJHRef": [NSString stringWithUTF8String:iterator.m_DJHRef.c_str()],
                    @"chapter": @(iterator.m_chapter),
                    @"verse": @(iterator.m_verse),
                    @"roleID": @(iterator.m_role),
                    @"name": [NSString stringWithUTF8String:iterator.m_source_name.c_str()],
                    @"number": @(iterator.m_source_occurrence),
                    @"monad": @(iterator.m_monad),
                    @"monadSet": @{@"first": @(iterator.m_first_monad), @"last": @(iterator.m_last_monad)}
                };
                [wordOccurrences addObject:wordOcccurrence];
            }
        }
        
        
        if (completion) completion([[NSArray alloc] initWithArray:wordOccurrences], nil);
    } catch (EMdFDBException e) {
        std::cerr << "ERROR: EMdFDBException (Database error)..." << std::endl;
        std::cerr << _emdrosEnv->getDBError() << std::endl;
        std::cerr << _emdrosEnv->getCompilerError() << std::endl;
    } catch (BadMonadsException e) {
        std::cerr << "BadMonadsException caught.  Program aborted." << std::endl;
    } catch (WrongCharacterSetException e) {
        std::cerr << "WrongCharacterSetException caught.  Program aborted." << std::endl;
    } catch (EMdFOutputException e) {
        std::cerr << "EMdFOutputException caught.  Program aborted." << std::endl;
    } catch (EmdrosException e) {
        std::cerr << "ERROR: EmdrosException (Emdros error)..." << e.what() << std::endl;
    } catch (...) {
        std::cerr << "Unknown exception occurred.  Program aborted." << std::endl;
    }
}

@end
