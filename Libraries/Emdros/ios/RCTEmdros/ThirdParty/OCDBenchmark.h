//
//  OCDBenchmark.h
//
//  Created by Jonathan Younger on 7/14/15.
//  Copyright (c) 2015 Overcommitted, LLC. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface OCDBenchmark : NSObject
+ (instancetype)sharedBenchmark;

- (uint64_t)begin;
- (uint64_t)end:(NSString *)description;

@end
