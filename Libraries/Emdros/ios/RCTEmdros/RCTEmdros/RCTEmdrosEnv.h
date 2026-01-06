//
//  Emdros.h
//  EmdrosKit
//
//  Copyright © 2016 Overcommitted, LLC. All rights reserved.
//

#import <Foundation/Foundation.h>

#define RCTEmdrosQuery(...) @#__VA_ARGS__

@interface RCTEmdrosEnv : NSObject

- (instancetype)initWithOptions:(NSDictionary *)options;

- (void)connect:(void (^)(BOOL isConnected, NSError *error))completion;

- (void)query:(NSString *)query options:(NSDictionary *)options completion:(void (^)(id result, NSError *error))completion;
- (void)wordsInMonads:(NSArray<NSArray<NSNumber *> *> *)monads limit:(NSInteger)limit useStopWords:(BOOL)useStopWords completion:(void (^)(id result, NSError *error))completion;
- (void)wordCountsForContext:(NSString *)context monads:(NSArray<NSArray<NSNumber *> *> *)monads contextFeatureComparison:(NSString *)contextFeatureComparison tokenFeatureComparison:(NSString *)tokenFeatureComparison completion:(void (^)(id result, NSError *error))completion;
- (void)wordOccurrencesForQuery:(NSString *)query completion:(void (^)(id result, NSError *error))completion;

- (void)stringFrom:(NSInteger)from to:(NSInteger)to options:(NSDictionary *)options completion:(void (^)(id result, NSError *error))completion;

- (NSString *)monadSetForBook:(NSString *)book;
- (NSDictionary *)monadSet:(NSDictionary *)options;
@end
