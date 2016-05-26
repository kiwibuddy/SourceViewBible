//
//  RNParallaxMotion.m
//  RNParallaxMotion
//
//  Copyright © 2016 Overcommitted, LLC. All rights reserved.
//
//  MIT License
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.
//

#import "RNParallaxMotion.h"
#import "RCTEventDispatcher.h"

@import CoreMotion;

@interface RNParallaxMotion ()
@property (strong) CMMotionManager *motionManager;
@end

@implementation RNParallaxMotion
@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

- (instancetype)init {
    self = [super init];
    if (self) {
        _motionManager = [CMMotionManager new];
    }
    
    return self;
}

RCT_EXPORT_METHOD(startUpdatesWithUpdateInterval:(NSTimeInterval)updateInterval) {
    self.motionManager.deviceMotionUpdateInterval = updateInterval;

    __weak typeof(self) weakSelf = self;
    [self.motionManager startDeviceMotionUpdatesUsingReferenceFrame:CMAttitudeReferenceFrameXArbitraryCorrectedZVertical toQueue:[NSOperationQueue mainQueue] withHandler:^(CMDeviceMotion * _Nullable motion, NSError * _Nullable error) {
        typeof(self) strongSelf = weakSelf; if (!strongSelf) return;
        
        if (motion) {
            NSDictionary *event = @{
                @"attitude": @{
                    @"pitch": @(motion.attitude.pitch),
                    @"roll": @(motion.attitude.roll),
                    @"yaw": @(motion.attitude.yaw)
                },
                @"rotationRate": @{
                    @"x": @(motion.rotationRate.x),
                    @"y": @(motion.rotationRate.y),
                    @"z": @(motion.rotationRate.z)
                },
                @"gravity": @{
                    @"x": @(motion.gravity.x),
                    @"y": @(motion.gravity.y),
                    @"z": @(motion.gravity.z)
                },
                @"userAcceleration": @{
                    @"x": @(motion.userAcceleration.x),
                    @"y": @(motion.userAcceleration.y),
                    @"z": @(motion.userAcceleration.z)
                },
                @"magneticField": @{
                    @"accuracy": @(motion.magneticField.accuracy),
                    @"field": @{
                        @"x": @(motion.magneticField.field.x),
                        @"y": @(motion.magneticField.field.y),
                        @"z": @(motion.magneticField.field.z)
                    }
                }
            };
            [self.bridge.eventDispatcher sendDeviceEventWithName:@"onParallaxMotionUpdate" body:event];
        } else if (error) {
            NSDictionary *event = @{@"error": @{@"description": error.description ?: @""}};
            [self.bridge.eventDispatcher sendDeviceEventWithName:@"onParallaxMotionError" body:event];
        }
    }];
}

RCT_EXPORT_METHOD(stopUpdates) {
    [self.motionManager stopDeviceMotionUpdates];
}

@end
