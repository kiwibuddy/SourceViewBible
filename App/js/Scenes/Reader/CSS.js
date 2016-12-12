/* @flow */
'use strict';

import {
  Colors,
  StyleSheet,
} from '../../Common';

module.exports = `
.s1 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 100.0%); }
.s2 { background: linear-gradient(180deg, #FFEACC, #FFEACC 100.0%); }
.s3 { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 100.0%); }
.s4 { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 100.0%); }
.s5 { background: linear-gradient(180deg, #D4F1F7, #D4F1F7 100.0%); }
.s6 { background: linear-gradient(180deg, #DEDEF7, #DEDEF7 100.0%); }
.s7 { background: linear-gradient(180deg, #F9DEEF, #F9DEEF 100.0%); }
.s1.s2 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 50.0%, #FFEACC 50.0%, #FFEACC); }
.s1.s3 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 50.0%, #FFF5CD 50.0%, #FFF5CD); }
.s1.s4 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 50.0%, #E8F4CE 50.0%, #E8F4CE); }
.s1.s5 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 50.0%, #D4F1F7 50.0%, #D4F1F7); }
.s1.s6 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 50.0%, #DEDEF7 50.0%, #DEDEF7); }
.s1.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 50.0%, #F9DEEF 50.0%, #F9DEEF); }
.s2.s3 { background: linear-gradient(180deg, #FFEACC, #FFEACC 50.0%, #FFF5CD 50.0%, #FFF5CD); }
.s2.s4 { background: linear-gradient(180deg, #FFEACC, #FFEACC 50.0%, #E8F4CE 50.0%, #E8F4CE); }
.s2.s5 { background: linear-gradient(180deg, #FFEACC, #FFEACC 50.0%, #D4F1F7 50.0%, #D4F1F7); }
.s2.s6 { background: linear-gradient(180deg, #FFEACC, #FFEACC 50.0%, #DEDEF7 50.0%, #DEDEF7); }
.s2.s7 { background: linear-gradient(180deg, #FFEACC, #FFEACC 50.0%, #F9DEEF 50.0%, #F9DEEF); }
.s3.s4 { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE); }
.s3.s5 { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 50.0%, #D4F1F7 50.0%, #D4F1F7); }
.s3.s6 { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 50.0%, #DEDEF7 50.0%, #DEDEF7); }
.s3.s7 { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 50.0%, #F9DEEF 50.0%, #F9DEEF); }
.s4.s5 { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7); }
.s4.s6 { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 50.0%, #DEDEF7 50.0%, #DEDEF7); }
.s4.s7 { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 50.0%, #F9DEEF 50.0%, #F9DEEF); }
.s5.s6 { background: linear-gradient(180deg, #D4F1F7, #D4F1F7 50.0%, #DEDEF7 50.0%, #DEDEF7); }
.s5.s7 { background: linear-gradient(180deg, #D4F1F7, #D4F1F7 50.0%, #F9DEEF 50.0%, #F9DEEF); }
.s6.s7 { background: linear-gradient(180deg, #DEDEF7, #DEDEF7 50.0%, #F9DEEF 50.0%, #F9DEEF); }
.s1.s2.s3 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFEACC 33.333%, #FFEACC 66.666%, #FFF5CD 66.667%, #FFF5CD); }
.s1.s2.s4 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFEACC 33.333%, #FFEACC 66.666%, #E8F4CE 66.667%, #E8F4CE); }
.s1.s2.s5 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFEACC 33.333%, #FFEACC 66.666%, #D4F1F7 66.667%, #D4F1F7); }
.s1.s2.s6 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFEACC 33.333%, #FFEACC 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.s1.s2.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFEACC 33.333%, #FFEACC 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.s1.s3.s4 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #E8F4CE 66.667%, #E8F4CE); }
.s1.s3.s5 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #D4F1F7 66.667%, #D4F1F7); }
.s1.s3.s6 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.s1.s3.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.s1.s4.s5 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #D4F1F7 66.667%, #D4F1F7); }
.s1.s4.s6 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.s1.s4.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.s1.s5.s6 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.s1.s5.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.s1.s6.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #DEDEF7 33.333%, #DEDEF7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.s2.s3.s4 { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #E8F4CE 66.667%, #E8F4CE); }
.s2.s3.s5 { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #D4F1F7 66.667%, #D4F1F7); }
.s2.s3.s6 { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.s2.s3.s7 { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.s2.s4.s5 { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #D4F1F7 66.667%, #D4F1F7); }
.s2.s4.s6 { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.s2.s4.s7 { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.s2.s5.s6 { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.s2.s5.s7 { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.s2.s6.s7 { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #DEDEF7 33.333%, #DEDEF7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.s3.s4.s5 { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #D4F1F7 66.667%, #D4F1F7); }
.s3.s4.s6 { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.s3.s4.s7 { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.s3.s5.s6 { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.s3.s5.s7 { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.s3.s6.s7 { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 33.333%, #DEDEF7 33.333%, #DEDEF7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.s4.s5.s6 { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.s4.s5.s7 { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.s4.s6.s7 { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 33.333%, #DEDEF7 33.333%, #DEDEF7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.s5.s6.s7 { background: linear-gradient(180deg, #D4F1F7, #D4F1F7 33.333%, #DEDEF7 33.333%, #DEDEF7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.s1.s2.s3.s4 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #FFF5CD 50.0%, #FFF5CD 75.0%, #E8F4CE 75.0%, #E8F4CE); }
.s1.s2.s3.s5 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #FFF5CD 50.0%, #FFF5CD 75.0%, #D4F1F7 75.0%, #D4F1F7); }
.s1.s2.s3.s6 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #FFF5CD 50.0%, #FFF5CD 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.s1.s2.s3.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #FFF5CD 50.0%, #FFF5CD 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.s1.s2.s4.s5 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #D4F1F7 75.0%, #D4F1F7); }
.s1.s2.s4.s6 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.s1.s2.s4.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.s1.s2.s5.s6 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.s1.s2.s5.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.s1.s2.s6.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.s1.s3.s4.s5 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #D4F1F7 75.0%, #D4F1F7); }
.s1.s3.s4.s6 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.s1.s3.s4.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.s1.s3.s5.s6 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.s1.s3.s5.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.s1.s3.s6.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.s1.s4.s5.s6 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.s1.s4.s5.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.s1.s4.s6.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.s1.s5.s6.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #D4F1F7 25.0%, #D4F1F7 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.s2.s3.s4.s5 { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #D4F1F7 75.0%, #D4F1F7); }
.s2.s3.s4.s6 { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.s2.s3.s4.s7 { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.s2.s3.s5.s6 { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.s2.s3.s5.s7 { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.s2.s3.s6.s7 { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.s2.s4.s5.s6 { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.s2.s4.s5.s7 { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.s2.s4.s6.s7 { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.s2.s5.s6.s7 { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #D4F1F7 25.0%, #D4F1F7 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.s3.s4.s5.s6 { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.s3.s4.s5.s7 { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.s3.s4.s6.s7 { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.s3.s5.s6.s7 { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 25.0%, #D4F1F7 25.0%, #D4F1F7 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.s4.s5.s6.s7 { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 25.0%, #D4F1F7 25.0%, #D4F1F7 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.s1.s2.s3.s4.s5 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #FFF5CD 40.0%, #FFF5CD 60.0%, #E8F4CE 60.0%, #E8F4CE 80.0%, #D4F1F7 80.0%, #D4F1F7); }
.s1.s2.s3.s4.s6 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #FFF5CD 40.0%, #FFF5CD 60.0%, #E8F4CE 60.0%, #E8F4CE 80.0%, #DEDEF7 80.0%, #DEDEF7); }
.s1.s2.s3.s4.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #FFF5CD 40.0%, #FFF5CD 60.0%, #E8F4CE 60.0%, #E8F4CE 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.s1.s2.s3.s5.s6 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #FFF5CD 40.0%, #FFF5CD 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #DEDEF7 80.0%, #DEDEF7); }
.s1.s2.s3.s5.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #FFF5CD 40.0%, #FFF5CD 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.s1.s2.s3.s6.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #FFF5CD 40.0%, #FFF5CD 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.s1.s2.s4.s5.s6 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #DEDEF7 80.0%, #DEDEF7); }
.s1.s2.s4.s5.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.s1.s2.s4.s6.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.s1.s2.s5.s6.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #D4F1F7 40.0%, #D4F1F7 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.s1.s3.s4.s5.s6 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #DEDEF7 80.0%, #DEDEF7); }
.s1.s3.s4.s5.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.s1.s3.s4.s6.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.s1.s3.s5.s6.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #D4F1F7 40.0%, #D4F1F7 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.s1.s4.s5.s6.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #E8F4CE 20.0%, #E8F4CE 40.0%, #D4F1F7 40.0%, #D4F1F7 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.s2.s3.s4.s5.s6 { background: linear-gradient(180deg, #FFEACC, #FFEACC 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #DEDEF7 80.0%, #DEDEF7); }
.s2.s3.s4.s5.s7 { background: linear-gradient(180deg, #FFEACC, #FFEACC 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.s2.s3.s4.s6.s7 { background: linear-gradient(180deg, #FFEACC, #FFEACC 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.s2.s3.s5.s6.s7 { background: linear-gradient(180deg, #FFEACC, #FFEACC 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #D4F1F7 40.0%, #D4F1F7 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.s2.s4.s5.s6.s7 { background: linear-gradient(180deg, #FFEACC, #FFEACC 20.0%, #E8F4CE 20.0%, #E8F4CE 40.0%, #D4F1F7 40.0%, #D4F1F7 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.s3.s4.s5.s6.s7 { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 20.0%, #E8F4CE 20.0%, #E8F4CE 40.0%, #D4F1F7 40.0%, #D4F1F7 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.s1.s2.s3.s4.s5.s6 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 16.667%, #FFEACC 16.667%, #FFEACC 33.334%, #FFF5CD 33.333%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 66.667%, #D4F1F7 66.667%, #D4F1F7 83.334%, #DEDEF7 83.333%, #DEDEF7); }
.s1.s2.s3.s4.s5.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 16.667%, #FFEACC 16.667%, #FFEACC 33.334%, #FFF5CD 33.333%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 66.667%, #D4F1F7 66.667%, #D4F1F7 83.334%, #F9DEEF 83.333%, #F9DEEF); }
.s1.s2.s3.s4.s6.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 16.667%, #FFEACC 16.667%, #FFEACC 33.334%, #FFF5CD 33.333%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 66.667%, #DEDEF7 66.667%, #DEDEF7 83.334%, #F9DEEF 83.333%, #F9DEEF); }
.s1.s2.s3.s5.s6.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 16.667%, #FFEACC 16.667%, #FFEACC 33.334%, #FFF5CD 33.333%, #FFF5CD 50.0%, #D4F1F7 50.0%, #D4F1F7 66.667%, #DEDEF7 66.667%, #DEDEF7 83.334%, #F9DEEF 83.333%, #F9DEEF); }
.s1.s2.s4.s5.s6.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 16.667%, #FFEACC 16.667%, #FFEACC 33.334%, #E8F4CE 33.333%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 66.667%, #DEDEF7 66.667%, #DEDEF7 83.334%, #F9DEEF 83.333%, #F9DEEF); }
.s1.s3.s4.s5.s6.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 16.667%, #FFF5CD 16.667%, #FFF5CD 33.334%, #E8F4CE 33.333%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 66.667%, #DEDEF7 66.667%, #DEDEF7 83.334%, #F9DEEF 83.333%, #F9DEEF); }
.s2.s3.s4.s5.s6.s7 { background: linear-gradient(180deg, #FFEACC, #FFEACC 16.667%, #FFF5CD 16.667%, #FFF5CD 33.334%, #E8F4CE 33.333%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 66.667%, #DEDEF7 66.667%, #DEDEF7 83.334%, #F9DEEF 83.333%, #F9DEEF); }
.s1.s2.s3.s4.s5.s6.s7 { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 14.286%, #FFEACC 14.286%, #FFEACC 28.572%, #FFF5CD 28.571%, #FFF5CD 42.857%, #E8F4CE 42.857%, #E8F4CE 57.143%, #D4F1F7 57.143%, #D4F1F7 71.429%, #DEDEF7 71.429%, #DEDEF7 85.715%, #F9DEEF 85.714%, #F9DEEF); }
`;
