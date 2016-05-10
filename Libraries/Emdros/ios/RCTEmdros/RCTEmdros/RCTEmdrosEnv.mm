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
        std::string password = "";

        _emdrosEnv = new EmdrosEnv(output_kind, kCSUTF8, hostname, user, password, initial_db, backend_kind);
    }

    dispatch_queue_t currentQueue = dispatch_get_current_queue();
    dispatch_async(self.queue, ^{
        BOOL isConnected = _emdrosEnv->connectionOk() == true;

        NSLog(@"Opened database");

        if (completion) {
            dispatch_async(currentQueue, ^{
                completion(isConnected, nil);
            });
        }
    });
}

- (void)query:(NSString *)query options:(NSDictionary *)options completion:(void (^)(id result, NSError *error))completion {
    NSLog(@"Executing query: %@", query);

    dispatch_queue_t currentQueue = dispatch_get_current_queue();
    dispatch_async(self.queue, ^{
        try {
            bool bResult;
            std::string strError;
            [[OCDBenchmark sharedBenchmark] begin];

            if (!_emdrosEnv->executeString(std::string(query.UTF8String), bResult, false, true)) {
                NSLog(@"FAILURE: Database error executing string.");
            } else {
                [[OCDBenchmark sharedBenchmark] end:[NSString stringWithFormat:@"Finished query: %@", query]];
                if (!bResult) {
                    NSLog(@"FAILURE: Compiler error executing string.");
                } else {
                    id result = nil;

                    Sheaf *sheaf = _emdrosEnv->takeOverSheaf();

                    if (sheaf) {
                        if (options[@"count"]) {
                            NSString *selectQuery = [query substringToIndex:[query rangeOfString:@"WHERE"].location];
                            NSString *query = [NSString stringWithFormat:@"%@ WHERE [chapter GET chapter] GO", selectQuery];

                            if (_emdrosEnv->executeString(std::string(query.UTF8String), bResult, false, true)) {
                                if (bResult) {
                                    Sheaf *binSheaf = _emdrosEnv->takeOverSheaf();
                                    MonadRange2BucketMap *bucketMap = makeBucketMapFromSheaf(binSheaf);
                                    delete binSheaf;

                                    [[OCDBenchmark sharedBenchmark] begin];
                                    countInSheaf(sheaf, bucketMap);
                                    [[OCDBenchmark sharedBenchmark] end:[NSString stringWithFormat:@"Finished countInSheaf"]];

                                    NSError *error = nil;
                                    result = [self dictionaryWithBucketMap:bucketMap error:&error];
                                    delete bucketMap;
                                }
                            }


                        } else {
                            SheafIterator si = sheaf->iterator();
                            while (si.hasNext()) {
//                                Straw *pStraw = si.next();


                            }
                        }
                        delete sheaf;


                        if (completion) {
                            dispatch_async(currentQueue, ^{
                                completion(result, nil);
                            });
                        }
                    }
                }
            }
        } catch (EmdrosException e) {
            std::cerr << "ERROR: EmdrosException (Emdros error)..." << e.what() << std::endl;
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
        } catch (...) {
            std::cerr << "Unknown exception occurred.  Program aborted." << std::endl;
        }
    });
}

- (void)stringFrom:(NSInteger)from to:(NSInteger)to options:(NSDictionary *)options completion:(void (^)(id result, NSError *error))completion {
//    extern std::string render_objects(EmdrosEnv *pEnv, const std::string& db_name, const std::string& JSON_stylesheet, const std::string& stylesheet, monad_m first_monad, monad_m last_monad, bool& bResult);

    dispatch_queue_t currentQueue = dispatch_get_current_queue();
    dispatch_async(self.queue, ^{
        try {
            NSString *stylesheet = ([options[@"stylesheet"] isKindOfClass:[NSString class]] ? options[@"stylesheet"] : [[NSString alloc] initWithData:[NSJSONSerialization dataWithJSONObject:options[@"stylesheet"] options:0 error:nil] encoding:NSUTF8StringEncoding]);

            std::string dbName("");
            std::string stylesheetString(stylesheet.UTF8String);
            std::string stylesheetName("base");
            bool bResult;
            std::string rendered_objects = render_objects(_emdrosEnv, dbName, stylesheetString, stylesheetName, from, to, bResult);
            NSString *string = [NSString stringWithUTF8String:rendered_objects.c_str()];
            if (completion) {
                dispatch_async(currentQueue, ^{
                    completion(string, nil);
                });
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
    });
}

- (NSString *)monadSetForBook:(NSString *)book {
    long firstMonad = 0;
    long lastMonad = 0;
    if (getMonadsForBook(_emdrosEnv, book.UTF8String, firstMonad, lastMonad)) {
        return [NSString stringWithFormat:@"{%ld-%ld}", firstMonad, lastMonad];
    }

    return nil;
}

#pragma mark - Private
- (NSDictionary *)dictionaryWithBucketMap:(MonadRange2BucketMap *)bucketMap error:(NSError **)error {
    std::string json = bucketMap->getJSON();
    NSString *data = [NSString stringWithUTF8String:json.c_str()];
    return [NSJSONSerialization JSONObjectWithData:[data dataUsingEncoding:NSUTF8StringEncoding] options:0 error:error];
}
@end
