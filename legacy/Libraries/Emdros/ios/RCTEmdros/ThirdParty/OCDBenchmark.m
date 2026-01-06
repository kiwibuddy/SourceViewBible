//
//  OCDBenchmark.m
//
//  Created by Jonathan Younger on 7/14/15.
//  Copyright (c) 2015 Overcommitted, LLC. All rights reserved.
//

#import "OCDBenchmark.h"
#import <mach/mach_time.h>

double OCDMachTimeToSeconds(uint64_t time) {
    mach_timebase_info_data_t timebase;
    mach_timebase_info(&timebase);
    return (double)time * (double)timebase.numer / (double)timebase.denom / 1e9;
}

@interface OCDBenchmark ()
@property (assign) uint64_t beginTime;
@property (assign) uint64_t endTime;
@end

@implementation OCDBenchmark

+ (instancetype)sharedBenchmark {
    static dispatch_once_t pred;
    static OCDBenchmark *shared = nil;
    
    dispatch_once(&pred, ^{
        shared = [[OCDBenchmark alloc] init];
    });
    return shared;
}

- (uint64_t)begin {
    self.beginTime = mach_absolute_time();
    return self.beginTime;
}

- (uint64_t)end:(NSString *)description {
    self.endTime = mach_absolute_time();
    
    NSLog(@"%@: %g s", (description ?: @"Elapsed time"), OCDMachTimeToSeconds(self.endTime - self.beginTime));
    
    return self.endTime;
}
@end
