//
//  Emdros.h
//  EmdrosKit
//
//  Copyright © 2016 Overcommitted, LLC. All rights reserved.
//

#import <Foundation/Foundation.h>

#define RCTEmdrosQuery(...) @#__VA_ARGS__

typedef NS_ENUM(NSInteger, RCTEmdrosBackendKind) {
    RCTEmdrosBackendKindNone = 0,     /**< No backend selected */
//    RCTEmdrosBackendKindSQL = 1,      /**< PostgreSQL */ Not yet implemented
//    RCTEmdrosBackendKindMySQL = 2,    /**< MySQL */ Not yet implemented
//    RCTEmdrosBackendKindSQLite2 = 3,  /**< SQLite 2.X.X */ Not yet implemented
    RCTEmdrosBackendKindSQLite3 = 4,  /**< SQLite 3.X.X */
    RCTEmdrosBackendKindBPT = 5       /**< Bit Packed Table */
};

@interface RCTEmdrosEnv : NSObject

- (instancetype)initWithOptions:(NSDictionary *)options;

- (void)connect:(void (^)(BOOL isConnected, NSError *error))completion;

- (void)query:(NSString *)query options:(NSDictionary *)options completion:(void (^)(id result, NSError *error))completion;

- (void)stringFrom:(NSInteger)from to:(NSInteger)to options:(NSDictionary *)options completion:(void (^)(id result, NSError *error))completion;

- (NSString *)monadSetForBook:(NSString *)book;
- (NSDictionary *)monadSet:(NSDictionary *)options;
@end
