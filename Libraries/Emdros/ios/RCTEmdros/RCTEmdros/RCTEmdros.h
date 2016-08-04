//
//  RCTEmdros.h
//  RCTEmdros
//
//  Created by Jonathan Younger on 3/28/16.
//  Copyright © 2016 Overcommitted, LLC. All rights reserved.
//

#import "RCTBridgeModule.h"

@interface RCTEmdros : NSObject <RCTBridgeModule>

- (void)open:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)close:(NSString *)database;

- (void)query:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)wordsInMonads:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)wordCountsForContext:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;

- (void)string:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;

- (void)monadSet:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
@end
