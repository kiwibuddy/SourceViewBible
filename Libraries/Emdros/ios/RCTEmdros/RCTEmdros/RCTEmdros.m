//
//  RCTEmdros.m
//  RCTEmdros
//
//  Created by Jonathan Younger on 3/28/16.
//  Copyright © 2016 Overcommitted, LLC. All rights reserved.
//

#import "RCTEmdros.h"
#import "RCTEmdrosEnv.h"

const char RCTKeyCString[] = {51, 102, 97, 98, 50, 101, 100, 99, 100, 56, 54, 54, 51, 99, 54, 98, 97, 97, 57, 49, 102, 102, 101, 98, 57, 50, 56, 101, 99, 54, 49, 101, 48, 49, 49, 98, 49, 57, 101, 100, 56, 54, 54, 100, 55, 51, 54, 53, 101, 55, 100, 49, 57, 52, 101, 52, 51, 100, 99, 52, 55, 50, 54, 52, 0};
#define RCTKEY [NSString stringWithCString:RCTKeyCString encoding:NSASCIIStringEncoding]

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
    NSString *name = [options[@"name"] lastPathComponent];
    NSString *directory = [options[@"name"] stringByDeletingLastPathComponent];
    NSString *database = [[NSBundle mainBundle] pathForResource:name ofType:nil inDirectory:directory];

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

    NSString *query = options[@"query"];
    [emdros query:query options:options completion:^(id result, NSError *error) {
        if (!error) {
            resolve(result);
        } else {
            reject(@"query_error", [NSString stringWithFormat:@"Error executing query %@", query], error);
        }
    }];
}

RCT_EXPORT_METHOD(wordCounts:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    RCTEmdrosEnv *emdros = [self databaseForName:options[@"name"]];
    
    NSArray *monads = nil;
    
    NSInteger from = [options[@"from"] integerValue];
    NSInteger to = [options[@"to"] integerValue];
    if (from > 0 && to > 0) {
        NSArray *monad = @[@(from), @(to)];
        monads = @[monad];
    } else {
        monads = options[@"monads"];
    }
    
    NSInteger limit = [options[@"limit"] integerValue];
    [emdros wordCounts:monads limit:limit completion:^(id result, NSError *error) {
        if (!error) {
            resolve(result);
        } else {
            reject(@"word_count_error", [NSString stringWithFormat:@"Error executing wordCount from: %li, to: %li", from, to], error);
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

RCT_EXPORT_METHOD(monadSet:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    RCTEmdrosEnv *emdros = [self databaseForName:options[@"name"]];

    NSDictionary *monadSet = [emdros monadSet:options];
    if (monadSet) {
        resolve(monadSet);
    } else {
        reject(@"monad_set_error", [NSString stringWithFormat:@"Error getting monad set for query: %@", options[@"query"]], nil);
    }
}

- (dispatch_queue_t)methodQueue {
    return dispatch_queue_create("com.facebook.React.Emdros", DISPATCH_QUEUE_SERIAL);
}

- (NSDictionary *)constantsToExport {
  return @{@"KEY": RCTKEY};
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
