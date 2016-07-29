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

const char RCTKeyCString[] = {48, 120, 51, 48, 97, 49, 50, 56, 50, 57, 32, 48, 120, 48, 50, 50, 56, 102, 53, 50, 55, 32, 48, 120, 49, 56, 55, 49, 56, 49, 51, 100, 32, 48, 120, 54, 53, 50, 53, 54, 55, 101, 57, 32, 48, 120, 53, 99, 101, 97, 50, 56, 98, 53, 32, 48, 120, 51, 100, 55, 100, 52, 98, 99, 55, 32, 48, 120, 53, 48, 48, 102, 101, 99, 100, 49, 32, 48, 120, 54, 99, 57, 51, 53, 54, 56, 100, 0};
#define RCTKey [NSString stringWithCString:RCTKeyCString encoding:NSASCIIStringEncoding]

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
           [[OCDBenchmark sharedBenchmark] begin];

            NSInteger firstMonad = options[@"firstMonad"] ? [options[@"firstMonad"] integerValue] : 1;
            NSInteger lastMonad = options[@"lastMonad"] ? [options[@"lastMonad"] integerValue] : MAX_MONAD;
            SetOfMonads substrate(firstMonad, lastMonad);

            std::string errorMessage;
            std::string json = countInBuckets(_emdrosEnv, std::string(query.UTF8String), substrate, errorMessage);
            [[OCDBenchmark sharedBenchmark] end:[NSString stringWithFormat:@"%@ countInBuckets", query]];

            [[OCDBenchmark sharedBenchmark] begin];
            NSString *data = [NSString stringWithUTF8String:json.c_str()];
            NSError *error = nil;
            NSDictionary *result = [NSJSONSerialization JSONObjectWithData:[data dataUsingEncoding:NSUTF8StringEncoding] options:0 error:&error];
            [[OCDBenchmark sharedBenchmark] end:[NSString stringWithFormat:@"%@ JSONObjectWithData", query]];

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

- (void)stringFrom:(NSInteger)from to:(NSInteger)to options:(NSDictionary *)options completion:(void (^)(id result, NSError *error))completion {
//    extern std::string render_objects(EmdrosEnv *pEnv, const std::string& db_name, const std::string& JSON_stylesheet, const std::string& stylesheet, monad_m first_monad, monad_m last_monad, bool& bResult);

    try {
        [[OCDBenchmark sharedBenchmark] begin];
        
        NSString *stylesheet = ([options[@"stylesheet"] isKindOfClass:[NSString class]] ? options[@"stylesheet"] : [[NSString alloc] initWithData:[NSJSONSerialization dataWithJSONObject:options[@"stylesheet"] options:0 error:nil] encoding:NSUTF8StringEncoding]);

        std::string dbName("");
        std::string stylesheetString(stylesheet.UTF8String);
        std::string stylesheetName("base");
        bool bResult;
        std::string rendered_objects = render_objects(_emdrosEnv, dbName, stylesheetString, stylesheetName, from, to, bResult);
        NSString *string = [NSString stringWithUTF8String:rendered_objects.c_str()];
        
        [[OCDBenchmark sharedBenchmark] end:[NSString stringWithFormat:@"stringFrom: %li, to: %li", (long)from, (long)to]];
        
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

@end
