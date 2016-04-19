//
//  RCTEmdros.m
//  RCTEmdros
//
//  Created by Jonathan Younger on 3/28/16.
//  Copyright © 2016 Overcommitted, LLC. All rights reserved.
//

#import "RCTEmdros.h"
#import "RCTEmdrosEnv.h"

@interface RCTEmdros ()
@property (strong) NSMutableDictionary *openedDatabases;
@end

@implementation RCTEmdros

RCT_EXPORT_MODULE(Emdros)

- (instancetype)init {
    self = [super init];
    if (self) {
        _openedDatabases = [NSMutableDictionary dictionaryWithCapacity:0];
    }
    
    return self;
}

RCT_EXPORT_METHOD(open:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    NSString *name = options[@"name"];
    NSString *database = [[NSBundle mainBundle] pathForResource:name ofType:nil];
    
    RCTEmdrosEnv *emdros = self.openedDatabases[database];
    if (emdros) {
        resolve(nil);
    } else {
        NSMutableDictionary *emdrosOptions = [NSMutableDictionary dictionaryWithDictionary:options];
        emdrosOptions[@"databasePath"] = database;
        
        emdros = [[RCTEmdrosEnv alloc] initWithOptions:emdrosOptions];
        
        __weak typeof(self) weakSelf = self;
        [emdros connect:^(BOOL isConnected, NSError *error) {
            typeof(self) strongSelf = weakSelf; if (!strongSelf) return;
            
            if (isConnected) {
                strongSelf.openedDatabases[database] = emdros;
                resolve(nil);
            } else {
                reject(@"open_error", [NSString stringWithFormat:@"Unable to open database: %@", name], error);
            }
        }];
    }
}

RCT_EXPORT_METHOD(close:(NSString *)name) {
    NSString *database = name;
    if (!self.openedDatabases[database]) {
        database = [[NSBundle mainBundle] pathForResource:name ofType:nil];
    }

    [self.openedDatabases removeObjectForKey:database];
}

RCT_EXPORT_METHOD(query:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    RCTEmdrosEnv *emdros = [self databaseForName:options[@"name"]];

    NSMutableDictionary *params = [NSMutableDictionary dictionaryWithDictionary:options];

    NSString *query = options[@"query"];
    
    if ([query componentsSeparatedByString:@"\n"].count <= 1) {
        params[@"count"] = @(YES);
        
        NSString *monadSet = [emdros monadSetForBook:query];
        
        query = [NSString stringWithFormat:RCTEmdrosQuery(
          COUNT ALL OBJECTS IN %@
          WHERE
          [Source GET source_color
           [Token is_word=true]
           ]
          GO), monadSet
        ];
    }
    
    if ([query.uppercaseString hasPrefix:@"COUNT"]) {
        query = [query stringByReplacingOccurrencesOfString:@"COUNT" withString:@"SELECT" options:NSCaseInsensitiveSearch range:NSMakeRange(0, MIN(5, query.length))];
        params[@"count"] = @(YES);
    }

    [emdros query:query options:params completion:^(id result, NSError *error) {
        if (!error) {
            resolve(result);
        } else {
            reject(@"query_error", [NSString stringWithFormat:@"Error executing query %@", query], error);
        }
    }];
}

RCT_EXPORT_METHOD(string:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    RCTEmdrosEnv *emdros = [self databaseForName:options[@"name"]];
    NSInteger from = [options[@"from"] integerValue];
    NSInteger to = [options[@"to"] integerValue];
    
    [emdros stringFrom:from to:to options:options completion:^(id result, NSError *error) {
        if (!error) {
            resolve(result);
        } else {
            reject(@"string_error", [NSString stringWithFormat:@"Error getting string from:%ld to:%ld", from, to], error);
        }
    }];
}

- (dispatch_queue_t)methodQueue {
    return dispatch_queue_create("com.facebook.React.Emdros", DISPATCH_QUEUE_SERIAL);
}

#pragma mark - Private
- (RCTEmdrosEnv *)databaseForName:(NSString *)name {
    NSString *database = name;
    if (!self.openedDatabases[database]) {
        database = [[NSBundle mainBundle] pathForResource:name ofType:nil];
    }
    
    return self.openedDatabases[database];
}
@end
