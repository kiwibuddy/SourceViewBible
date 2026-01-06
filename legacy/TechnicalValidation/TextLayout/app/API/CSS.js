/* @flow */
'use strict';

module.exports = `
.hFam { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 100.0%); }
.hEco { background: linear-gradient(180deg, #FFEACC, #FFEACC 100.0%); }
.hGov { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 100.0%); }
.hRel { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 100.0%); }
.hEdu { background: linear-gradient(180deg, #D4F1F7, #D4F1F7 100.0%); }
.hCom { background: linear-gradient(180deg, #DEDEF7, #DEDEF7 100.0%); }
.hCel { background: linear-gradient(180deg, #F9DEEF, #F9DEEF 100.0%); }
.hFam.hEco { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 50.0%, #FFEACC 50.0%, #FFEACC); }
.hFam.hGov { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 50.0%, #FFF5CD 50.0%, #FFF5CD); }
.hFam.hRel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 50.0%, #E8F4CE 50.0%, #E8F4CE); }
.hFam.hEdu { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 50.0%, #D4F1F7 50.0%, #D4F1F7); }
.hFam.hCom { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 50.0%, #DEDEF7 50.0%, #DEDEF7); }
.hFam.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 50.0%, #F9DEEF 50.0%, #F9DEEF); }
.hEco.hGov { background: linear-gradient(180deg, #FFEACC, #FFEACC 50.0%, #FFF5CD 50.0%, #FFF5CD); }
.hEco.hRel { background: linear-gradient(180deg, #FFEACC, #FFEACC 50.0%, #E8F4CE 50.0%, #E8F4CE); }
.hEco.hEdu { background: linear-gradient(180deg, #FFEACC, #FFEACC 50.0%, #D4F1F7 50.0%, #D4F1F7); }
.hEco.hCom { background: linear-gradient(180deg, #FFEACC, #FFEACC 50.0%, #DEDEF7 50.0%, #DEDEF7); }
.hEco.hCel { background: linear-gradient(180deg, #FFEACC, #FFEACC 50.0%, #F9DEEF 50.0%, #F9DEEF); }
.hGov.hRel { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE); }
.hGov.hEdu { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 50.0%, #D4F1F7 50.0%, #D4F1F7); }
.hGov.hCom { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 50.0%, #DEDEF7 50.0%, #DEDEF7); }
.hGov.hCel { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 50.0%, #F9DEEF 50.0%, #F9DEEF); }
.hRel.hEdu { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7); }
.hRel.hCom { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 50.0%, #DEDEF7 50.0%, #DEDEF7); }
.hRel.hCel { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 50.0%, #F9DEEF 50.0%, #F9DEEF); }
.hEdu.hCom { background: linear-gradient(180deg, #D4F1F7, #D4F1F7 50.0%, #DEDEF7 50.0%, #DEDEF7); }
.hEdu.hCel { background: linear-gradient(180deg, #D4F1F7, #D4F1F7 50.0%, #F9DEEF 50.0%, #F9DEEF); }
.hCom.hCel { background: linear-gradient(180deg, #DEDEF7, #DEDEF7 50.0%, #F9DEEF 50.0%, #F9DEEF); }
.hFam.hEco.hGov { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFEACC 33.333%, #FFEACC 66.666%, #FFF5CD 66.667%, #FFF5CD); }
.hFam.hEco.hRel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFEACC 33.333%, #FFEACC 66.666%, #E8F4CE 66.667%, #E8F4CE); }
.hFam.hEco.hEdu { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFEACC 33.333%, #FFEACC 66.666%, #D4F1F7 66.667%, #D4F1F7); }
.hFam.hEco.hCom { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFEACC 33.333%, #FFEACC 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.hFam.hEco.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFEACC 33.333%, #FFEACC 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.hFam.hGov.hRel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #E8F4CE 66.667%, #E8F4CE); }
.hFam.hGov.hEdu { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #D4F1F7 66.667%, #D4F1F7); }
.hFam.hGov.hCom { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.hFam.hGov.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.hFam.hRel.hEdu { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #D4F1F7 66.667%, #D4F1F7); }
.hFam.hRel.hCom { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.hFam.hRel.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.hFam.hEdu.hCom { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.hFam.hEdu.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.hFam.hCom.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #DEDEF7 33.333%, #DEDEF7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.hEco.hGov.hRel { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #E8F4CE 66.667%, #E8F4CE); }
.hEco.hGov.hEdu { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #D4F1F7 66.667%, #D4F1F7); }
.hEco.hGov.hCom { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.hEco.hGov.hCel { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.hEco.hRel.hEdu { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #D4F1F7 66.667%, #D4F1F7); }
.hEco.hRel.hCom { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.hEco.hRel.hCel { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.hEco.hEdu.hCom { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.hEco.hEdu.hCel { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.hEco.hCom.hCel { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #DEDEF7 33.333%, #DEDEF7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.hGov.hRel.hEdu { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #D4F1F7 66.667%, #D4F1F7); }
.hGov.hRel.hCom { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.hGov.hRel.hCel { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.hGov.hEdu.hCom { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.hGov.hEdu.hCel { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.hGov.hCom.hCel { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 33.333%, #DEDEF7 33.333%, #DEDEF7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.hRel.hEdu.hCom { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.hRel.hEdu.hCel { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.hRel.hCom.hCel { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 33.333%, #DEDEF7 33.333%, #DEDEF7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.hEdu.hCom.hCel { background: linear-gradient(180deg, #D4F1F7, #D4F1F7 33.333%, #DEDEF7 33.333%, #DEDEF7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.hFam.hEco.hGov.hRel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #FFF5CD 50.0%, #FFF5CD 75.0%, #E8F4CE 75.0%, #E8F4CE); }
.hFam.hEco.hGov.hEdu { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #FFF5CD 50.0%, #FFF5CD 75.0%, #D4F1F7 75.0%, #D4F1F7); }
.hFam.hEco.hGov.hCom { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #FFF5CD 50.0%, #FFF5CD 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.hFam.hEco.hGov.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #FFF5CD 50.0%, #FFF5CD 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.hFam.hEco.hRel.hEdu { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #D4F1F7 75.0%, #D4F1F7); }
.hFam.hEco.hRel.hCom { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.hFam.hEco.hRel.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.hFam.hEco.hEdu.hCom { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.hFam.hEco.hEdu.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.hFam.hEco.hCom.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.hFam.hGov.hRel.hEdu { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #D4F1F7 75.0%, #D4F1F7); }
.hFam.hGov.hRel.hCom { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.hFam.hGov.hRel.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.hFam.hGov.hEdu.hCom { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.hFam.hGov.hEdu.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.hFam.hGov.hCom.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.hFam.hRel.hEdu.hCom { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.hFam.hRel.hEdu.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.hFam.hRel.hCom.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.hFam.hEdu.hCom.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #D4F1F7 25.0%, #D4F1F7 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.hEco.hGov.hRel.hEdu { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #D4F1F7 75.0%, #D4F1F7); }
.hEco.hGov.hRel.hCom { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.hEco.hGov.hRel.hCel { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.hEco.hGov.hEdu.hCom { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.hEco.hGov.hEdu.hCel { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.hEco.hGov.hCom.hCel { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.hEco.hRel.hEdu.hCom { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.hEco.hRel.hEdu.hCel { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.hEco.hRel.hCom.hCel { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.hEco.hEdu.hCom.hCel { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #D4F1F7 25.0%, #D4F1F7 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.hGov.hRel.hEdu.hCom { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.hGov.hRel.hEdu.hCel { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.hGov.hRel.hCom.hCel { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.hGov.hEdu.hCom.hCel { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 25.0%, #D4F1F7 25.0%, #D4F1F7 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.hRel.hEdu.hCom.hCel { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 25.0%, #D4F1F7 25.0%, #D4F1F7 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.hFam.hEco.hGov.hRel.hEdu { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #FFF5CD 40.0%, #FFF5CD 60.0%, #E8F4CE 60.0%, #E8F4CE 80.0%, #D4F1F7 80.0%, #D4F1F7); }
.hFam.hEco.hGov.hRel.hCom { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #FFF5CD 40.0%, #FFF5CD 60.0%, #E8F4CE 60.0%, #E8F4CE 80.0%, #DEDEF7 80.0%, #DEDEF7); }
.hFam.hEco.hGov.hRel.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #FFF5CD 40.0%, #FFF5CD 60.0%, #E8F4CE 60.0%, #E8F4CE 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.hFam.hEco.hGov.hEdu.hCom { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #FFF5CD 40.0%, #FFF5CD 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #DEDEF7 80.0%, #DEDEF7); }
.hFam.hEco.hGov.hEdu.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #FFF5CD 40.0%, #FFF5CD 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.hFam.hEco.hGov.hCom.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #FFF5CD 40.0%, #FFF5CD 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.hFam.hEco.hRel.hEdu.hCom { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #DEDEF7 80.0%, #DEDEF7); }
.hFam.hEco.hRel.hEdu.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.hFam.hEco.hRel.hCom.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.hFam.hEco.hEdu.hCom.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #D4F1F7 40.0%, #D4F1F7 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.hFam.hGov.hRel.hEdu.hCom { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #DEDEF7 80.0%, #DEDEF7); }
.hFam.hGov.hRel.hEdu.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.hFam.hGov.hRel.hCom.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.hFam.hGov.hEdu.hCom.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #D4F1F7 40.0%, #D4F1F7 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.hFam.hRel.hEdu.hCom.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #E8F4CE 20.0%, #E8F4CE 40.0%, #D4F1F7 40.0%, #D4F1F7 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.hEco.hGov.hRel.hEdu.hCom { background: linear-gradient(180deg, #FFEACC, #FFEACC 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #DEDEF7 80.0%, #DEDEF7); }
.hEco.hGov.hRel.hEdu.hCel { background: linear-gradient(180deg, #FFEACC, #FFEACC 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.hEco.hGov.hRel.hCom.hCel { background: linear-gradient(180deg, #FFEACC, #FFEACC 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.hEco.hGov.hEdu.hCom.hCel { background: linear-gradient(180deg, #FFEACC, #FFEACC 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #D4F1F7 40.0%, #D4F1F7 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.hEco.hRel.hEdu.hCom.hCel { background: linear-gradient(180deg, #FFEACC, #FFEACC 20.0%, #E8F4CE 20.0%, #E8F4CE 40.0%, #D4F1F7 40.0%, #D4F1F7 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.hGov.hRel.hEdu.hCom.hCel { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 20.0%, #E8F4CE 20.0%, #E8F4CE 40.0%, #D4F1F7 40.0%, #D4F1F7 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.hFam.hEco.hGov.hRel.hEdu.hCom { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 16.667%, #FFEACC 16.667%, #FFEACC 33.334%, #FFF5CD 33.333%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 66.667%, #D4F1F7 66.667%, #D4F1F7 83.334%, #DEDEF7 83.333%, #DEDEF7); }
.hFam.hEco.hGov.hRel.hEdu.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 16.667%, #FFEACC 16.667%, #FFEACC 33.334%, #FFF5CD 33.333%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 66.667%, #D4F1F7 66.667%, #D4F1F7 83.334%, #F9DEEF 83.333%, #F9DEEF); }
.hFam.hEco.hGov.hRel.hCom.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 16.667%, #FFEACC 16.667%, #FFEACC 33.334%, #FFF5CD 33.333%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 66.667%, #DEDEF7 66.667%, #DEDEF7 83.334%, #F9DEEF 83.333%, #F9DEEF); }
.hFam.hEco.hGov.hEdu.hCom.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 16.667%, #FFEACC 16.667%, #FFEACC 33.334%, #FFF5CD 33.333%, #FFF5CD 50.0%, #D4F1F7 50.0%, #D4F1F7 66.667%, #DEDEF7 66.667%, #DEDEF7 83.334%, #F9DEEF 83.333%, #F9DEEF); }
.hFam.hEco.hRel.hEdu.hCom.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 16.667%, #FFEACC 16.667%, #FFEACC 33.334%, #E8F4CE 33.333%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 66.667%, #DEDEF7 66.667%, #DEDEF7 83.334%, #F9DEEF 83.333%, #F9DEEF); }
.hFam.hGov.hRel.hEdu.hCom.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 16.667%, #FFF5CD 16.667%, #FFF5CD 33.334%, #E8F4CE 33.333%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 66.667%, #DEDEF7 66.667%, #DEDEF7 83.334%, #F9DEEF 83.333%, #F9DEEF); }
.hEco.hGov.hRel.hEdu.hCom.hCel { background: linear-gradient(180deg, #FFEACC, #FFEACC 16.667%, #FFF5CD 16.667%, #FFF5CD 33.334%, #E8F4CE 33.333%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 66.667%, #DEDEF7 66.667%, #DEDEF7 83.334%, #F9DEEF 83.333%, #F9DEEF); }
.hFam.hEco.hGov.hRel.hEdu.hCom.hCel { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 14.286%, #FFEACC 14.286%, #FFEACC 28.572%, #FFF5CD 28.571%, #FFF5CD 42.857%, #E8F4CE 42.857%, #E8F4CE 57.143%, #D4F1F7 57.143%, #D4F1F7 71.429%, #DEDEF7 71.429%, #DEDEF7 85.715%, #F9DEEF 85.714%, #F9DEEF); }
`;
